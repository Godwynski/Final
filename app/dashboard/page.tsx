import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { StatusChart, TypeChart, TrendChart } from '@/components/AnalyticsCharts'
import { getFilteredAnalytics, getActionItems } from './actions'
import RealtimeListener from '@/components/RealtimeListener'
import ActionRequired from '@/components/ActionRequired'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import DashboardControls from '@/components/dashboard/DashboardControls'
import StatsGrid from '@/components/dashboard/StatsGrid'
import RecentCasesTable from '@/components/dashboard/RecentCasesTable'

export default async function Dashboard(props: { searchParams: Promise<{ range?: string, type?: string, status?: string }> }) {
    const searchParams = await props.searchParams
    const range = searchParams.range || '30d'
    const filterType = searchParams.type
    const filterStatus = searchParams.status

    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Fetch filtered analytics
    const analyticsData = await getFilteredAnalytics(range, filterType, filterStatus)
    const { stats, comparison, statusData, typeData, trendData } = analyticsData
    const { staleCases, upcomingHearings } = await getActionItems()

    // Calculate percentage change for Total Cases
    const totalChange = comparison.total > 0
        ? ((stats.total - comparison.total) / comparison.total) * 100
        : 0

    // Fetch recent cases (still need this separately or could be part of the same action if optimized)
    let recentCasesQuery = supabase
        .from('cases')
        .select('id, case_number, title, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

    // Apply same filters to recent cases
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
            const endDate = new Date(now.getFullYear(), now.getMonth(), 0)
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

    if (range !== 'all') {
        recentCasesQuery = recentCasesQuery.gte('created_at', startDate.toISOString())
    }
    if (filterType) {
        recentCasesQuery = recentCasesQuery.eq('incident_type', filterType)
    }
    if (filterStatus) {
        recentCasesQuery = recentCasesQuery.eq('status', filterStatus)
    }

    const { data: recentCases } = await recentCasesQuery

    return (
        <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto">
            <RealtimeListener />
            <ActionRequired staleCases={staleCases} upcomingHearings={upcomingHearings} />

            <DashboardHeader userProfile={profile} />

            <DashboardControls analyticsData={analyticsData} />

            {/* Print Header (Visible only when printing) */}
            <div className="hidden print:block mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Blotter System Report</h1>
                <p className="text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
            </div>

            <StatsGrid stats={stats} range={range} totalChange={totalChange} />

            {/* Recent Cases & Status Chart Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Cases Table - Takes up 2 columns */}
                <div className="lg:col-span-2">
                    <RecentCasesTable recentCases={recentCases} />
                </div>

                {/* Status Chart - Takes up 1 column */}
                <div className="lg:col-span-1 print:col-span-1">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:border-gray-700 dark:bg-gray-800 p-4 h-full">
                        <StatusChart data={statusData} />
                    </div>
                </div>
            </div>

            {/* Bottom Row: Types and Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:border-gray-700 dark:bg-gray-800 p-4">
                    <TypeChart data={typeData} />
                </div>
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:border-gray-700 dark:bg-gray-800 p-4">
                    <TrendChart data={trendData} />
                </div>
            </div>
        </div>
    )
}
