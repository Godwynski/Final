'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { unstable_cache } from 'next/cache'

export const getFilteredAnalytics = unstable_cache(
    getFilteredAnalyticsInternal,
    ['dashboard-analytics'],
    { revalidate: 60, tags: ['dashboard'] }
)

async function getFilteredAnalyticsInternal(
    range: string = '30d',
    filterType?: string,
    filterStatus?: string,
    customStartDate?: string,
    customEndDate?: string
) {
    const supabase = createAdminClient()

    // Calculate date range
    const now = new Date()
    let startDate: Date | null = new Date()
    let prevStartDate: Date | null = new Date()

    switch (range) {
        case 'this_week':
            const day = now.getDay()
            const diff = now.getDate() - day + (day === 0 ? -6 : 1)
            startDate = new Date(now.setDate(diff))
            startDate.setHours(0, 0, 0, 0)
            prevStartDate = new Date(startDate)
            prevStartDate.setDate(prevStartDate.getDate() - 7)
            break
        case 'this_month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1)
            prevStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
            break
        case 'last_month':
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
            prevStartDate = new Date(now.getFullYear(), now.getMonth() - 2, 1)
            break
        case 'this_quarter':
            const quarter = Math.floor((now.getMonth() + 3) / 3)
            startDate = new Date(now.getFullYear(), (quarter - 1) * 3, 1)
            prevStartDate = new Date(now.getFullYear(), (quarter - 2) * 3, 1)
            break
        case 'ytd':
            startDate = new Date(now.getFullYear(), 0, 1)
            prevStartDate = new Date(now.getFullYear() - 1, 0, 1)
            break
        case '7d':
            startDate.setDate(now.getDate() - 7)
            prevStartDate.setDate(now.getDate() - 14)
            break
        case '30d':
            startDate.setDate(now.getDate() - 30)
            prevStartDate.setDate(now.getDate() - 60)
            break
        case 'all':
            startDate = null
            prevStartDate = null
            break
        case 'custom':
        case 'specific':
            if (customStartDate) {
                startDate = new Date(customStartDate)
                // If specific (same day), end date is end of that day. 
                // If custom, use provided end date or default to end of start date
                const end = customEndDate ? new Date(customEndDate) : new Date(customStartDate)

                // Ensure end of day for end date
                end.setHours(23, 59, 59, 999)
                // Current start is start of day
                startDate.setHours(0, 0, 0, 0)

                // Calculate previous period
                const duration = end.getTime() - startDate.getTime()
                prevStartDate = new Date(startDate.getTime() - duration - 1) // 1ms buffer? No, just duration
                // Actually to compare "same period before":
                prevStartDate = new Date(startDate.getTime() - (duration + 1)) // Subtract duration
            } else {
                startDate = null
                prevStartDate = null
            }
            break
        default:
            // Check if range is a year (e.g., "2024")
            if (/^\d{4}$/.test(range)) {
                startDate = new Date(parseInt(range), 0, 1)
                prevStartDate = new Date(parseInt(range) - 1, 0, 1)
            } else {
                // Fallback
                startDate.setDate(now.getDate() - 30)
                prevStartDate.setDate(now.getDate() - 60)
            }
            break
    }

    // For non-custom ranges, we need to ensure endDate is handled if we want to support strict windows
    // But existing logic passes p_end_date: null (which means "to now")
    // For custom/specific, we MUST pass the calculated endDate.
    let p_end_date = null
    if (range === 'custom' || range === 'specific' || /^\d{4}$/.test(range)) {
        // handle specific end date logic passed to RPC?
        // RPC p_end_date usually defaults to now if null.
        // If we have a specific window (custom/specific/year), we should determine it.
        if (range === 'custom' || range === 'specific') {
            p_end_date = customEndDate ? new Date(customEndDate) : (customStartDate ? new Date(customStartDate) : new Date())
            p_end_date.setHours(23, 59, 59, 999)
        } else if (/^\d{4}$/.test(range)) {
            p_end_date = new Date(parseInt(range), 11, 31, 23, 59, 59)
        }
    }

    // Parallelize Main Stats and Charts
    const [statsResult, chartsResult] = await Promise.all([
        supabase.rpc('get_case_stats_dynamic', {
            p_start_date: startDate?.toISOString() || null,
            p_end_date: p_end_date ? p_end_date.toISOString() : null,
            p_type: filterType || null,
            p_status: filterStatus || null
        }),
        supabase.rpc('get_analytics_charts_dynamic', {
            p_start_date: startDate?.toISOString() || null,
            p_end_date: p_end_date ? p_end_date.toISOString() : null,
            p_type: filterType || null,
            p_status: filterStatus || null
        })
    ])

    const { data: stats, error: statsError } = statsResult
    const { data: charts, error: chartsError } = chartsResult

    if (statsError || chartsError || !stats || !charts) {
        console.error('Analytics Error:', JSON.stringify({ statsError, chartsError, stats, charts }, null, 2))
        return {
            statusData: [],
            typeData: [],
            trendData: [],
            stats: { total: 0, active: 0, resolved: 0, new: 0 },
            comparison: { total: 0, active: 0, resolved: 0, new: 0 }
        }
    }

    // Comparison Logic (Fetch previous period stats)
    let comparison = { total: 0, active: 0, resolved: 0, new: 0 }

    if (startDate && prevStartDate) {
        const { data: prevStats } = await supabase.rpc('get_case_stats_dynamic', {
            p_start_date: prevStartDate.toISOString(),
            p_end_date: startDate.toISOString(),
            p_type: filterType || null,
            p_status: filterStatus || null
        })
        if (prevStats) comparison = prevStats
    }

    return {
        statusData: charts.statusData,
        typeData: charts.typeData,
        trendData: charts.trendData,
        stats,
        comparison
    }
}

export const getRecentCases = unstable_cache(
    getRecentCasesInternal,
    ['recent-cases'],
    { revalidate: 30, tags: ['dashboard', 'cases'] }
)

async function getRecentCasesInternal(
    range: string = '30d',
    filterType?: string,
    filterStatus?: string,
    customStartDate?: string,
    customEndDate?: string
) {
    const supabase = createAdminClient()

    let recentCasesQuery = supabase
        .from('cases')
        .select('id, case_number, title, status, created_at')
        .order('created_at', { ascending: false })
        .limit(10)

    const now = new Date()
    let startDate = new Date()
    switch (range) {
        case 'this_week':
            const day = now.getDay()
            const diff = now.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
            startDate = new Date(now.setDate(diff))
            startDate.setHours(0, 0, 0, 0)
            break
        case 'this_month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1)
            break
        case 'last_month':
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
            break
        case 'this_quarter':
            const quarter = Math.floor((now.getMonth() + 3) / 3)
            startDate = new Date(now.getFullYear(), (quarter - 1) * 3, 1)
            break
        case 'ytd':
            startDate = new Date(now.getFullYear(), 0, 1)
            break
        case '7d':
            startDate.setDate(now.getDate() - 7)
            break
        case '30d':
            startDate.setDate(now.getDate() - 30)
            break
        case 'all':
            startDate = new Date(0)
            break
    }

    if (range === 'custom' || range === 'specific') {
        if (customStartDate) {
            startDate = new Date(customStartDate)
            startDate.setHours(0, 0, 0, 0)
        }
    }

    if (range !== 'all') {
        recentCasesQuery = recentCasesQuery.gte('created_at', startDate.toISOString())
        if ((range === 'custom' || range === 'specific' || /^\d{4}$/.test(range))) {
            let endDate = new Date()
            if (range === 'custom' && customEndDate) endDate = new Date(customEndDate)
            else if (range === 'specific' && customStartDate) endDate = new Date(customStartDate)
            else if (/^\d{4}$/.test(range)) endDate = new Date(parseInt(range), 11, 31)

            endDate.setHours(23, 59, 59, 999)
            recentCasesQuery = recentCasesQuery.lte('created_at', endDate.toISOString())
        }
    }
    if (filterType) {
        recentCasesQuery = recentCasesQuery.eq('incident_type', filterType)
    }
    if (filterStatus) {
        recentCasesQuery = recentCasesQuery.eq('status', filterStatus)
    }

    const { data: recentCases } = await recentCasesQuery
    return recentCases || []
}

export interface PersonStats {
    name: string
    roles: string[]
    contact: string | null
    caseCount: number
    lastActive: string
    caseIds: string[]
}

export async function getPeople(query: string = '', page: number = 1, limit: number = 10, sort: string = 'name', order: string = 'asc') {
    const supabase = await createClient()
    const from = (page - 1) * limit
    const to = from + limit - 1

    let queryBuilder = supabase
        .from('party_statistics')
        .select('*', { count: 'exact' })
        .order(sort, { ascending: order === 'asc' })
        .range(from, to)

    if (query) {
        queryBuilder = queryBuilder.ilike('name', `%${query}%`)
    }

    const { data: people, count, error } = await queryBuilder

    if (error || !people) {
        console.error('getPeople Error:', error)
        return { people: [], total: 0 }
    }

    // Cast to expected type
    const typedPeople = people as unknown as PersonStats[]

    return { people: typedPeople, total: count || 0 }
}

export async function getPersonHistory(name: string) {
    const supabase = await createClient()

    const { data: parties, error } = await supabase
        .from('involved_parties')
        .select('*, cases(id, case_number, title, status, incident_date)')
        .eq('name', name)
        .order('created_at', { ascending: false })

    if (error || !parties) return []

    return parties.map(p => ({
        role: p.type,
        case: p.cases
    }))
}

export const getActionItems = unstable_cache(
    async () => {
        const supabase = createAdminClient() // Use admin client to avoid cookies() in cache
        const now = new Date()
        const staleDate = new Date()
        staleDate.setDate(now.getDate() - 15)

        const next7Days = new Date()
        next7Days.setDate(now.getDate() + 7)

        const [staleCasesResult, hearingsResult] = await Promise.all([
            // 1. Stale Cases (New/Under Investigation > 15 days)
            supabase
                .from('cases')
                .select('id, case_number, title, status, updated_at')
                .in('status', ['New', 'Under Investigation'])
                .lt('updated_at', staleDate.toISOString())
                .limit(5),

                // 2. Upcoming Hearings (Next 7 days)
            supabase
                .from('hearings')
                .select('*, cases!inner(id, case_number, title, status)')
                .gte('hearing_date', now.toISOString())
                .lte('hearing_date', next7Days.toISOString())
                .in('cases.status', ['New', 'Under Investigation', 'Hearing Scheduled'])
                .order('hearing_date', { ascending: true })
                .limit(5)
        ])

        return {
            staleCases: staleCasesResult.data || [],
            upcomingHearings: hearingsResult.data || []
        }
    },
    ['action-items'],
    { revalidate: 120, tags: ['dashboard', 'cases', 'hearings'] }
)

export const getMonthlyHearings = unstable_cache(
    async (year: number, month: number) => {
        const supabase = createAdminClient() // Use admin client to avoid cookies() in cache

        // Start of month
        const startDate = new Date(year, month, 1)
        // End of month
        const endDate = new Date(year, month + 1, 0)
        endDate.setHours(23, 59, 59, 999)

        const { data: hearings } = await supabase
            .from('hearings')
            .select('*, cases(id, case_number, title, status, incident_date)')
            .gte('hearing_date', startDate.toISOString())
            .lte('hearing_date', endDate.toISOString())
            .order('hearing_date', { ascending: true })

        return hearings || []
    },
    ['monthly-hearings'],
    { revalidate: 300, tags: ['hearings'] }
)

export const getCachedProfile = unstable_cache(
    async (userId: string) => {
        const supabase = createAdminClient()
        const { data } = await supabase
            .from('profiles')
            .select('full_name, role, force_password_change')
            .eq('id', userId)
            .single()
        return data
    },
    ['profile'],
    { revalidate: 300, tags: ['profile'] }
)

export const getCachedNewCasesCount = unstable_cache(
    async () => {
        const supabase = createAdminClient()
        const { count } = await supabase
            .from('cases')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'New')
        return count || 0
    },
    ['new-cases-count'],
    { revalidate: 60, tags: ['cases'] }
)
