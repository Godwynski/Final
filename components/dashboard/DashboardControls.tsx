import DateRangePicker from '@/components/DateRangePicker'
import FilterDropdown from '@/components/FilterDropdown'

interface DashboardControlsProps {
    analyticsData: any
}

export default function DashboardControls({ analyticsData }: DashboardControlsProps) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 print:hidden">
            <div className="flex-1">
                <DateRangePicker />
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <FilterDropdown
                    label="Filter Type"
                    paramName="type"
                    options={['Theft', 'Harassment', 'Vandalism', 'Physical Injury', 'Property Damage', 'Public Disturbance', 'Other']}
                />
            </div>
        </div>
    )
}
