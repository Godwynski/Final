import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getCachedProfile } from '../../actions'
import { getVisits, getVisitStats } from './actions'
import VisitsClient from './VisitsClient'
import type { Metadata } from 'next'
import { getDateRangeFromParams } from '@/utils/dateRange'

export const metadata: Metadata = {
    title: 'Visit Monitor | Dashboard',
    description: 'Monitor website visitor activity and analytics'
}

type SearchParams = {
    page?: string
    limit?: string
    visitType?: string
    role?: string
    device?: string
    search?: string
    range?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: string
    os?: string
    browser?: string
    excludeAdmins?: string
}

export default async function VisitsPage(props: { searchParams: Promise<SearchParams> }) {
    const searchParams = await props.searchParams
    const supabase = await createClient()

    // Parse all URL parameters with defaults
    const page = Number(searchParams.page) || 1
    const limit = Number(searchParams.limit) || 25
    const visitType = searchParams.visitType // Can still filter by type if manually added to URL
    const role = searchParams.role || 'all'
    const device = searchParams.device || 'all'
    const search = searchParams.search || ''
    const range = searchParams.range || '30d'
    const customStart = searchParams.startDate
    const customEnd = searchParams.endDate

    const { startDate: calculatedStart, endDate: calculatedEnd } = getDateRangeFromParams(range, customStart, customEnd)

    // Format for DB/Props
    const startDate = calculatedStart.toISOString()
    // calculatedEnd can be null (for 'to now' logic) so we handle that
    const endDate = calculatedEnd ? calculatedEnd.toISOString() : ''

    const sortBy = searchParams.sortBy || 'visited_at'
    const sortOrder = (searchParams.sortOrder as 'asc' | 'desc') || 'desc'
    const os = searchParams.os || 'all'
    const browser = searchParams.browser || 'all'
    const excludeAdmins = searchParams.excludeAdmins === 'true'

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return redirect('/login')

    // Verify Admin Role
    const profile = await getCachedProfile(user.id)

    if (profile?.role !== 'admin') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <svg className="mx-auto w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Unauthorized Access</h1>
                    <p className="text-gray-500 mb-4">You do not have permission to view this page.</p>
                    <a href="/dashboard" className="text-blue-600 hover:underline font-medium">Return to Dashboard</a>
                </div>
            </div>
        )
    }

    const [{ visits, total }, stats] = await Promise.all([
        getVisits({
            page,
            limit,
            visitType,
            role,
            device,
            startDate: startDate,
            endDate: endDate,
            search: search || undefined,
            sortBy,
            sortOrder,
            os,
            browser,
            excludeAdmins
        }),
        getVisitStats(startDate, endDate)
    ])

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-cyan-100 dark:bg-cyan-900/30 shrink-0">
                        <svg className="w-7 h-7 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Visit Monitor</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
                            Track page views, sessions, and unique daily visitors with detailed analytics.
                        </p>
                    </div>
                </div>

                <VisitsClient
                    initialVisits={visits}
                    initialStats={stats}
                    totalCount={total}
                    currentPage={page}
                    currentLimit={limit}
                    currentRole={role}
                    currentDevice={device}
                    currentVisitType={visitType || 'page_view'}
                    currentSearch={search}
                    currentStartDate={startDate}
                    currentEndDate={endDate}
                    currentSortBy={sortBy}
                    currentSortOrder={sortOrder}
                    currentOs={os}
                    currentBrowser={browser}
                    currentExcludeAdmins={excludeAdmins}
                />
            </div>
        </div>
    )
}
