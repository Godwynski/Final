import DateRangePicker from '@/components/DateRangePicker'
import FilterDropdown from '@/components/FilterDropdown'
import ExportButton from '@/components/ExportButton'

interface DashboardControlsProps {
    analyticsData: any // Using any for now to match the prop type in page.tsx, ideally should be typed
}

export default function DashboardControls({ analyticsData }: DashboardControlsProps) {
    return (
        <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 print:hidden">
            <div className="flex-1 min-w-[200px]">
                <DateRangePicker />
            </div>
            <div className="flex items-center gap-3">
                <FilterDropdown
                    label="Filter Type"
                    paramName="type"
                    options={['Theft', 'Harassment', 'Vandalism', 'Physical Injury', 'Property Damage', 'Public Disturbance', 'Other']}
                />
                <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
                <ExportButton data={analyticsData} />
            </div>
        </div>
    )
}
