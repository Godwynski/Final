import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

import { getFilteredAnalytics, getActionItems, getRecentCases } from './actions'
import RealtimeListener from '@/components/RealtimeListener'
import ActionRequired from '@/components/ActionRequired'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import DashboardControls from '@/components/dashboard/DashboardControls'
import StatsGrid from '@/components/dashboard/StatsGrid'
import RecentCasesTable from '@/components/dashboard/RecentCasesTable'
import DashboardCalendar from '@/components/dashboard/DashboardCalendar'

import DashboardCharts from '@/components/dashboard/DashboardCharts'

export default async function Dashboard(props: { searchParams: Promise<{ range?: string, type?: string, status?: string }> }) {
    const searchParams = await props.searchParams
    const range = searchParams.range || 'all'
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

    // Fetch filtered analytics and other dashboard data in parallel
    const [analyticsData, actionItems, recentCases] = await Promise.all([
        getFilteredAnalytics(range, filterType, filterStatus),
        getActionItems(),
        getRecentCases(range, filterType, filterStatus)
    ])

    const { stats, comparison, statusData, typeData, trendData } = analyticsData
    const { staleCases, upcomingHearings } = actionItems

    // Calculate percentage change for Total Cases
    const totalChange = comparison.total > 0
        ? ((stats.total - comparison.total) / comparison.total) * 100
        : 0

    return (
        <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto">
            <RealtimeListener />

            <div className="flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <DashboardHeader userProfile={profile} />
                    <DashboardControls analyticsData={analyticsData} />
                </div>
            </div>

            {/* Print Header (Visible only when printing) */}
            <div className="hidden print:block mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Blotter System Report</h1>
                <p className="text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
            </div>

            <StatsGrid stats={stats} range={range} totalChange={totalChange} />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Charts & Activity */}
                <div className="lg:col-span-2 space-y-6">
                    <DashboardCharts
                        statusData={statusData}
                        typeData={typeData}
                        trendData={trendData}
                    />

                    {/* Recent Cases */}
                    <div>
                        <RecentCasesTable recentCases={recentCases} />
                    </div>
                </div>

                {/* Right Column: Action Hub */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6 space-y-6">
                        <ActionRequired staleCases={staleCases} upcomingHearings={upcomingHearings} />
                        <DashboardCalendar />
                    </div>
                </div>
            </div>
        </div>
    )
}
