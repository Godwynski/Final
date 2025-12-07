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
}

export type VisitStats = {
    totalPageViews: number
    totalSessions: number
    uniqueDailyVisitors: number
    todayPageViews: number
    todaySessions: number
    todayUniqueVisitors: number
    topPages: { page: string; count: number }[]
    browserStats: { name: string; count: number }[]
    deviceStats: { name: string; count: number }[]
}

export async function getVisits(
    page: number = 1,
    limit: number = 25,
    visitType?: string,
    startDate?: string,
    endDate?: string
): Promise<{ visits: SiteVisit[]; total: number }> {
    const supabase = await createClient()
    const offset = (page - 1) * limit

    let query = supabase
        .from('site_visits')
        .select('*', { count: 'exact' })
        .order('visited_at', { ascending: false })

    if (visitType && visitType !== 'all') {
        query = query.eq('visit_type', visitType)
    }
    if (startDate) {
        query = query.gte('visited_at', startDate)
    }
    if (endDate) {
        query = query.lte('visited_at', endDate)
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1)

    if (error) {
        console.error('Error fetching visits:', error)
        return { visits: [], total: 0 }
    }

    return { visits: data || [], total: count || 0 }
}

export async function getVisitStats(): Promise<VisitStats> {
    const supabase = await createClient()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get total page views
    const { count: totalPageViews } = await supabase
        .from('site_visits')
        .select('*', { count: 'exact', head: true })
        .eq('visit_type', 'page_view')

    // Get total sessions
    const { count: totalSessions } = await supabase
        .from('site_visits')
        .select('*', { count: 'exact', head: true })
        .eq('visit_type', 'session')

    // Get unique daily visitors (total)
    const { count: uniqueDailyVisitors } = await supabase
        .from('site_visits')
        .select('*', { count: 'exact', head: true })
        .eq('visit_type', 'unique_daily')

    // Get today's page views
    const { count: todayPageViews } = await supabase
        .from('site_visits')
        .select('*', { count: 'exact', head: true })
        .eq('visit_type', 'page_view')
        .gte('visited_at', today.toISOString())

    // Get today's sessions
    const { count: todaySessions } = await supabase
        .from('site_visits')
        .select('*', { count: 'exact', head: true })
        .eq('visit_type', 'session')
        .gte('visited_at', today.toISOString())

    // Get today's unique visitors
    const { count: todayUniqueVisitors } = await supabase
        .from('site_visits')
        .select('*', { count: 'exact', head: true })
        .eq('visit_type', 'unique_daily')
        .gte('visited_at', today.toISOString())

    // Get top pages (from page_view type only)
    const { data: pageData } = await supabase
        .from('site_visits')
        .select('page_path')
        .eq('visit_type', 'page_view')

    const pageCounts: Record<string, number> = {}
    pageData?.forEach(v => {
        pageCounts[v.page_path] = (pageCounts[v.page_path] || 0) + 1
    })
    const topPages = Object.entries(pageCounts)
        .map(([page, count]) => ({ page, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

    // Get browser stats (from session type for unique browsers)
    const { data: browserData } = await supabase
        .from('site_visits')
        .select('browser')
        .eq('visit_type', 'session')

    const browserCounts: Record<string, number> = {}
    browserData?.forEach(v => {
        const name = v.browser || 'Unknown'
        browserCounts[name] = (browserCounts[name] || 0) + 1
    })
    const browserStats = Object.entries(browserCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)

    // Get device stats (from session type)
    const { data: deviceData } = await supabase
        .from('site_visits')
        .select('device_type')
        .eq('visit_type', 'session')

    const deviceCounts: Record<string, number> = {}
    deviceData?.forEach(v => {
        const name = v.device_type || 'Unknown'
        deviceCounts[name] = (deviceCounts[name] || 0) + 1
    })
    const deviceStats = Object.entries(deviceCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)

    return {
        totalPageViews: totalPageViews || 0,
        totalSessions: totalSessions || 0,
        uniqueDailyVisitors: uniqueDailyVisitors || 0,
        todayPageViews: todayPageViews || 0,
        todaySessions: todaySessions || 0,
        todayUniqueVisitors: todayUniqueVisitors || 0,
        topPages,
        browserStats,
        deviceStats,
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
