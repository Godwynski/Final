'use client'

import dynamic from 'next/dynamic'
import { memo } from 'react'

const StatusChart = dynamic(() => import('@/components/AnalyticsCharts').then(mod => mod.StatusChart), {
    loading: () => <div className="h-full w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />,
    ssr: false
})
const TypeChart = dynamic(() => import('@/components/AnalyticsCharts').then(mod => mod.TypeChart), {
    loading: () => <div className="h-full w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />,
    ssr: false
})
const TrendChart = dynamic(() => import('@/components/AnalyticsCharts').then(mod => mod.TrendChart), {
    loading: () => <div className="h-full w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />,
    ssr: false
})

interface DashboardChartsProps {
    statusData: any[]
    typeData: any[]
    trendData: any[]
}

function DashboardCharts({ statusData, typeData, trendData }: DashboardChartsProps) {
    return (
        <div className="space-y-6">
            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:border-gray-700 dark:bg-gray-800 p-4 h-[300px]">
                    <StatusChart data={statusData} />
                </div>
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:border-gray-700 dark:bg-gray-800 p-4 h-[300px]">
                    <TypeChart data={typeData} />
                </div>
            </div>

            {/* Trend Chart */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:border-gray-700 dark:bg-gray-800 p-4 h-[300px]">
                <TrendChart data={trendData} />
            </div>
        </div>
    )
}

// Memoize component to prevent re-renders when props haven't changed
export default memo(DashboardCharts, (prevProps, nextProps) => {
    // Custom comparison: only re-render if data actually changed
    return (
        JSON.stringify(prevProps.statusData) === JSON.stringify(nextProps.statusData) &&
        JSON.stringify(prevProps.typeData) === JSON.stringify(nextProps.typeData) &&
        JSON.stringify(prevProps.trendData) === JSON.stringify(nextProps.trendData)
    )
})
