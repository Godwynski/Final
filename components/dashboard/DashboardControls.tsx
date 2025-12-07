'use client'

import DateRangePicker from '@/components/DateRangePicker'
import FilterDropdown from '@/components/FilterDropdown'
import { useRouter, useSearchParams } from 'next/navigation'
import { X } from 'lucide-react'

interface DashboardControlsProps {
    analyticsData: any
}

export default function DashboardControls({ analyticsData }: DashboardControlsProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const hasFilters = searchParams.has('type') || searchParams.has('status') || (searchParams.get('range') && searchParams.get('range') !== 'all')

    const clearFilters = () => {
        router.push('/dashboard')
    }

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 print:hidden">
            <div className="flex-1">
                <DateRangePicker defaultValue="all" />
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <FilterDropdown
                    label="Type"
                    paramName="type"
                    options={['Theft', 'Harassment', 'Vandalism', 'Physical Injury', 'Property Damage', 'Public Disturbance', 'Other']}
                />
                <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
                <FilterDropdown
                    label="Status"
                    paramName="status"
                    options={['New', 'Under Investigation', 'Resolved', 'Closed']}
                />
            </div>

            {hasFilters && (
                <button
                    onClick={clearFilters}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                >
                    <X className="w-4 h-4" />
                    Clear
                </button>
            )}
        </div>
    )
}
