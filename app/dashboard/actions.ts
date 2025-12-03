'use server'

import { createClient } from '@/utils/supabase/server'

export async function getFilteredAnalytics(
    range: string = '30d',
    filterType?: string,
    filterStatus?: string
) {
    const supabase = await createClient()

    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    let prevStartDate = new Date()

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
            startDate = new Date(0) // Beginning of time
            break
    }

    // Base query
    let query = supabase.from('cases').select('id, status, incident_type, created_at')

    if (range !== 'all') {
        query = query.gte('created_at', startDate.toISOString())
    }

    if (filterType) {
        query = query.eq('incident_type', filterType)
    }

    if (filterStatus) {
        query = query.eq('status', filterStatus)
    }

    const { data: cases, error } = await query

    if (error || !cases) {
        return {
            statusData: [],
            typeData: [],
            trendData: [],
            stats: { total: 0, active: 0, resolved: 0, new: 0 },
            comparison: { total: 0, active: 0, resolved: 0, new: 0 }
        }
    }

    // Process Data for Charts
    const statusMap = new Map<string, number>()
    const typeMap = new Map<string, number>()
    const trendMap = new Map<string, number>()

    let activeCount = 0
    let resolvedCount = 0
    let newCount = 0

    cases.forEach(c => {
        // Status
        statusMap.set(c.status, (statusMap.get(c.status) || 0) + 1)

        // Type
        const type = c.incident_type || 'Other'
        typeMap.set(type, (typeMap.get(type) || 0) + 1)

        // Trend (by Month)
        const date = new Date(c.created_at)
        const monthKey = date.toLocaleString('default', { month: 'short' })
        trendMap.set(monthKey, (trendMap.get(monthKey) || 0) + 1)

        // Counts
        if (['New', 'Under Investigation'].includes(c.status)) activeCount++
        if (['Settled', 'Closed', 'Dismissed'].includes(c.status)) resolvedCount++
        if (c.status === 'New') newCount++
    })

    // Format for Recharts
    const statusData = Array.from(statusMap.entries()).map(([name, value]) => ({ name, value }))
    const typeData = Array.from(typeMap.entries()).map(([name, value]) => ({ name, value }))

    // Sort trend data chronologically (simplified for now, assumes data within a year or sorts by month index)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const trendData = Array.from(trendMap.entries())
        .map(([name, cases]) => ({ name, cases }))
        .sort((a, b) => months.indexOf(a.name) - months.indexOf(b.name))

    // Comparison Logic (Simplified: Fetch previous period count only for Total Cases for demo)
    // In a real app, you'd run a second query for the previous period for all metrics
    let comparison = { total: 0, active: 0, resolved: 0, new: 0 }

    if (range !== 'all') {
        const { data: prevCases } = await supabase
            .from('cases')
            .select('status')
            .gte('created_at', prevStartDate.toISOString())
            .lt('created_at', startDate.toISOString())

        if (prevCases) {
            comparison.total = prevCases.length
            prevCases.forEach(c => {
                if (['New', 'Under Investigation'].includes(c.status)) comparison.active++
                if (['Settled', 'Closed', 'Dismissed'].includes(c.status)) comparison.resolved++
                if (c.status === 'New') comparison.new++
            })
        }
    }

    return {
        statusData,
        typeData,
        trendData,
        stats: {
            total: cases.length,
            active: activeCount,
            resolved: resolvedCount,
            new: newCount
        },
        comparison
    }
}

export async function getPeople(query: string = '', page: number = 1, limit: number = 10, sort: string = 'name', order: string = 'asc') {
    const supabase = await createClient()
    const from = (page - 1) * limit
    const to = from + limit - 1

    let queryBuilder = supabase
        .from('involved_parties')
        .select('name, type, contact_number, case_id, created_at')
        .order('name', { ascending: true }) // Initial fetch order for aggregation

    if (query) {
        queryBuilder = queryBuilder.ilike('name', `%${query}%`)
    }

    const { data: parties, error } = await queryBuilder

    if (error || !parties) return { people: [], total: 0 }

    // Aggregate by Name
    const peopleMap = new Map<string, {
        name: string,
        roles: Set<string>,
        contact: string,
        caseCount: number,
        lastActive: string,
        caseIds: Set<string>
    }>()

    parties.forEach(p => {
        const existing = peopleMap.get(p.name) || {
            name: p.name,
            roles: new Set(),
            contact: p.contact_number || '',
            caseCount: 0,
            lastActive: p.created_at,
            caseIds: new Set()
        }

        existing.roles.add(p.type)
        if (p.contact_number) existing.contact = p.contact_number
        existing.caseCount++
        if (new Date(p.created_at) > new Date(existing.lastActive)) existing.lastActive = p.created_at
        existing.caseIds.add(p.case_id)

        peopleMap.set(p.name, existing)
    })

    const allPeople = Array.from(peopleMap.values()).map(p => ({
        ...p,
        roles: Array.from(p.roles),
        caseIds: Array.from(p.caseIds)
    }))

    // Sort
    allPeople.sort((a, b) => {
        let valA = a[sort as keyof typeof a]
        let valB = b[sort as keyof typeof b]

        if (typeof valA === 'string') valA = valA.toLowerCase()
        if (typeof valB === 'string') valB = valB.toLowerCase()

        if (valA < valB) return order === 'asc' ? -1 : 1
        if (valA > valB) return order === 'asc' ? 1 : -1
        return 0
    })

    // Pagination
    const total = allPeople.length
    const paginatedPeople = allPeople.slice(from, to + 1)

    return { people: paginatedPeople, total }
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

export async function getActionItems() {
    const supabase = await createClient()
    const now = new Date()
    const staleDate = new Date()
    staleDate.setDate(now.getDate() - 15)

    // 1. Stale Cases (New/Under Investigation > 15 days)
    const { data: staleCases } = await supabase
        .from('cases')
        .select('id, case_number, title, status, updated_at')
        .in('status', ['New', 'Under Investigation'])
        .lt('updated_at', staleDate.toISOString())
        .limit(5)

    // 2. Upcoming Hearings (Next 48 hours)
    const next48Hours = new Date()
    next48Hours.setHours(now.getHours() + 48)

    const { data: hearings } = await supabase
        .from('hearings')
        .select('*, cases(id, case_number, title)')
        .gte('hearing_date', now.toISOString())
        .lte('hearing_date', next48Hours.toISOString())
        .order('hearing_date', { ascending: true })
        .limit(5)

    return {
        staleCases: staleCases || [],
        upcomingHearings: hearings || []
    }
}

export async function getMonthlyHearings(year: number, month: number) {
    const supabase = await createClient()

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
}
