'use server'

import { createClient } from '@/utils/supabase/server'

export type SiteVisit = {
    id: string
    ip_address: string | null
    user_agent: string | null
    page_path: string
    referrer: string | null
    country: string | null
    city: string | null
    device_type: string | null
    browser: string | null
    os: string | null
    visit_type: string | null
    session_id: string | null
    visited_at: string
    visitor_name: string | null
    visitor_email: string | null
    visitor_role: string | null
}

export type VisitStats = {
    totalPageViews: number
    totalSessions: number
    uniqueDailyVisitors: number
    uniquePeople: number
    todayPageViews: number
    todaySessions: number
    todayUniqueVisitors: number
    avgDailyPageViews: number
    topPages: { page: string; count: number }[]
    browserStats: { name: string; count: number }[]
    deviceStats: { name: string; count: number }[]
    hourlyDistribution: { hour: number; count: number }[]
}

export type VisitFilters = {
    page?: number
    limit?: number
    visitType?: string
    role?: string
    device?: string
    startDate?: string
    endDate?: string
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    os?: string
    browser?: string
    excludeAdmins?: boolean
}

export async function getVisits(filters: VisitFilters = {}): Promise<{ visits: SiteVisit[]; total: number }> {
    const supabase = await createClient()
    const {
        page = 1,
        limit = 25,
        visitType = 'page_view', // Default to page_view only for cleanliness
        role,
        device,
        startDate,
        endDate,
        search,
        sortBy = 'visited_at',
        sortOrder = 'desc',
        os,
        browser,
        excludeAdmins
    } = filters

    const offset = (page - 1) * limit

    let query = supabase
        .from('site_visits')
        .select('*', { count: 'exact' })

    // Apply filters
    if (visitType && visitType !== 'all') {
        query = query.eq('visit_type', visitType)
    }
    if (role && role !== 'all') {
        query = query.eq('visitor_role', role)
    }
    if (device && device !== 'all') {
        query = query.eq('device_type', device)
    }
    if (startDate) {
        query = query.gte('visited_at', startDate)
    }
    if (endDate) {
        // Add end of day to include the full end date
        const endDateTime = new Date(endDate)
        endDateTime.setHours(23, 59, 59, 999)
        query = query.lte('visited_at', endDateTime.toISOString())
    }
    if (search) {
        query = query.or(`ip_address.ilike.%${search}%,page_path.ilike.%${search}%,visitor_email.ilike.%${search}%,visitor_name.ilike.%${search}%`)
    }
    if (os && os !== 'all') {
        query = query.eq('os', os)
    }
    if (browser && browser !== 'all') {
        query = query.eq('browser', browser)
    }
    if (excludeAdmins) {
        query = query.neq('visitor_role', 'admin')
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    const { data, error, count } = await query.range(offset, offset + limit - 1)

    if (error) {
        console.error('Error fetching visits:', error)
        return { visits: [], total: 0 }
    }

    return { visits: data || [], total: count || 0 }
}

export async function getVisitStats(startDate?: string, endDate?: string): Promise<VisitStats> {
    const supabase = await createClient()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Build query for aggregation stats with filters
    let allVisitsQuery = supabase
        .from('site_visits')
        .select('page_path, browser, device_type, visit_type, visited_at, visitor_email')

    if (startDate) {
        allVisitsQuery = allVisitsQuery.gte('visited_at', startDate)
    }
    if (endDate) {
        const endDateTime = new Date(endDate)
        endDateTime.setHours(23, 59, 59, 999)
        allVisitsQuery = allVisitsQuery.lte('visited_at', endDateTime.toISOString())
    }

    // Base queries for totals
    let pageViewsQuery = supabase
        .from('site_visits')
        .select('*', { count: 'exact', head: true })
        .eq('visit_type', 'page_view')

    let sessionsQuery = supabase
        .from('site_visits')
        .select('*', { count: 'exact', head: true })
        .eq('visit_type', 'session')

    let uniqueDailyQuery = supabase
        .from('site_visits')
        .select('*', { count: 'exact', head: true })
        .eq('visit_type', 'unique_daily')

    // Apply date filters to totals if they exist
    if (startDate) {
        pageViewsQuery = pageViewsQuery.gte('visited_at', startDate)
        sessionsQuery = sessionsQuery.gte('visited_at', startDate)
        uniqueDailyQuery = uniqueDailyQuery.gte('visited_at', startDate)
    }
    if (endDate) {
        const endDateTime = new Date(endDate)
        endDateTime.setHours(23, 59, 59, 999)
        const isoEnd = endDateTime.toISOString()

        pageViewsQuery = pageViewsQuery.lte('visited_at', isoEnd)
        sessionsQuery = sessionsQuery.lte('visited_at', isoEnd)
        uniqueDailyQuery = uniqueDailyQuery.lte('visited_at', isoEnd)
    }

    // Parallel fetch for all stats - much faster!
    const [
        pageViewsResult,
        sessionsResult,
        uniqueDailyResult,
        todayPageViewsResult,
        todaySessionsResult,
        todayUniqueResult,
        allVisitsResult,
    ] = await Promise.all([
        // Total page views (Filtered)
        pageViewsQuery,
        // Total sessions (Filtered)
        sessionsQuery,
        // Unique daily visitors (Filtered)
        uniqueDailyQuery,
        // Today's page views
        supabase
            .from('site_visits')
            .select('*', { count: 'exact', head: true })
            .eq('visit_type', 'page_view')
            .gte('visited_at', today.toISOString()),
        // Today's sessions
        supabase
            .from('site_visits')
            .select('*', { count: 'exact', head: true })
            .eq('visit_type', 'session')
            .gte('visited_at', today.toISOString()),
        // Today's unique
        supabase
            .from('site_visits')
            .select('*', { count: 'exact', head: true })
            .eq('visit_type', 'unique_daily')
            .gte('visited_at', today.toISOString()),
        // Aggregation visits (Filtered by Date Range)
        allVisitsQuery
    ])

    const allVisits = allVisitsResult.data || []

    // Calculate aggregations from single query result
    const pageCounts: Record<string, number> = {}
    const browserCounts: Record<string, number> = {}
    const deviceCounts: Record<string, number> = {}
    const hourCounts: Record<number, number> = {}
    const dailyPageViews: Record<string, number> = {}

    // Unique People Calculation (Set of emails)
    const uniquePeopleSet = new Set<string>()

    allVisits.forEach(v => {
        // Collect unique emails
        if (v.visitor_email) {
            uniquePeopleSet.add(v.visitor_email)
        }

        // Top pages (page views only)
        if (v.visit_type === 'page_view') {
            pageCounts[v.page_path] = (pageCounts[v.page_path] || 0) + 1

            // Daily aggregation for average
            const dayKey = new Date(v.visited_at).toISOString().split('T')[0]
            dailyPageViews[dayKey] = (dailyPageViews[dayKey] || 0) + 1

            // Hourly distribution
            const hour = new Date(v.visited_at).getHours()
            hourCounts[hour] = (hourCounts[hour] || 0) + 1
        }

        // Browser stats (sessions only for unique counts)
        if (v.visit_type === 'session') {
            const browser = v.browser || 'Unknown'
            browserCounts[browser] = (browserCounts[browser] || 0) + 1

            const device = v.device_type || 'Unknown'
            deviceCounts[device] = (deviceCounts[device] || 0) + 1
        }
    })

    const topPages = Object.entries(pageCounts)
        .map(([page, count]) => ({ page, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

    const browserStats = Object.entries(browserCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)

    const deviceStats = Object.entries(deviceCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)

    const hourlyDistribution = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        count: hourCounts[hour] || 0
    }))

    // Calculate average daily page views
    const dailyValues = Object.values(dailyPageViews)
    const avgDailyPageViews = dailyValues.length > 0
        ? Math.round(dailyValues.reduce((a, b) => a + b, 0) / dailyValues.length)
        : 0

    return {
        totalPageViews: pageViewsResult.count || 0,
        totalSessions: sessionsResult.count || 0,
        uniqueDailyVisitors: uniqueDailyResult.count || 0,
        uniquePeople: uniquePeopleSet.size,
        todayPageViews: todayPageViewsResult.count || 0,
        todaySessions: todaySessionsResult.count || 0,
        todayUniqueVisitors: todayUniqueResult.count || 0,
        avgDailyPageViews,
        topPages,
        browserStats,
        deviceStats,
        hourlyDistribution,
    }
}

export async function deleteVisit(id: string): Promise<boolean> {
    const supabase = await createClient()
    const { error } = await supabase
        .from('site_visits')
        .delete()
        .eq('id', id)

    return !error
}

export async function clearOldVisits(daysOld: number = 30): Promise<number> {
    const supabase = await createClient()
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    const { data, error } = await supabase
        .from('site_visits')
        .delete()
        .lt('visited_at', cutoffDate.toISOString())
        .select('id')

    if (error) {
        console.error('Error clearing old visits:', error)
        return 0
    }

    return data?.length || 0
}

export async function exportVisitsCSV(filters: VisitFilters = {}): Promise<string> {
    const supabase = await createClient()
    const { visitType, startDate, endDate, search } = filters

    let query = supabase
        .from('site_visits')
        .select('visited_at, visit_type, ip_address, page_path, browser, device_type, os, referrer')
        .order('visited_at', { ascending: false })
        .limit(10000) // Max export limit

    if (visitType && visitType !== 'all') {
        query = query.eq('visit_type', visitType)
    }
    if (startDate) {
        query = query.gte('visited_at', startDate)
    }
    if (endDate) {
        const endDateTime = new Date(endDate)
        endDateTime.setHours(23, 59, 59, 999)
        query = query.lte('visited_at', endDateTime.toISOString())
    }
    if (search) {
        query = query.or(`ip_address.ilike.%${search}%,page_path.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error || !data) {
        console.error('Error exporting visits:', error)
        return ''
    }

    // Convert to CSV
    const headers = ['Date/Time', 'Type', 'IP Address', 'Page', 'Browser', 'Device', 'OS', 'Referrer']
    const rows = data.map(v => [
        new Date(v.visited_at).toLocaleString(),
        v.visit_type || 'page_view',
        v.ip_address || 'Unknown',
        v.page_path,
        v.browser || 'Unknown',
        v.device_type || 'Unknown',
        v.os || 'Unknown',
        v.referrer || ''
    ])

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    return csvContent
}
