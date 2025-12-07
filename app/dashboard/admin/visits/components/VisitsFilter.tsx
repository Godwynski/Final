'use client'

import { Search, Filter, Monitor, Chrome, X, Download, Trash2, RefreshCw } from 'lucide-react'
import DateRangePicker from '@/components/DateRangePicker'

type VisitsFilterProps = {
    filters: {
        search: string
        role: string
        device: string
        os: string
        browser: string
        excludeAdmins: boolean
        startDate: string
        endDate: string
    }
    onUpdate: (params: Record<string, string | boolean | number>) => void
    onClear: () => void
    onExport: () => void
    onClearOld: () => void
    onRefresh: () => void
    isExporting: boolean
    isClearing: boolean
    autoRefresh: boolean
    setAutoRefresh: (val: boolean) => void
}

export default function VisitsFilter({
    filters,
    onUpdate,
    onClear,
    onExport,
    onClearOld,
    onRefresh,
    isExporting,
    isClearing,
    autoRefresh,
    setAutoRefresh
}: VisitsFilterProps) {
    const hasActiveFilters = filters.search ||
        (filters.role && filters.role !== 'all') ||
        (filters.device && filters.device !== 'all') ||
        (filters.os && filters.os !== 'all') ||
        (filters.browser && filters.browser !== 'all') ||
        (filters.startDate || filters.endDate)

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
            {/* Top Row: Search & Actions */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                {/* Search */}
                <div className="relative w-full lg:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search IP, page, email..."
                        value={filters.search}
                        onChange={(e) => onUpdate({ search: e.target.value, page: '1' })}
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>

                {/* Actions Group */}
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                    <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <input
                            type="checkbox"
                            checked={autoRefresh}
                            onChange={(e) => setAutoRefresh(e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        Auto-refresh
                    </label>

                    <button
                        onClick={onRefresh}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>

                    <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

                    <button
                        onClick={onExport}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <Download className="w-4 h-4" />
                        {isExporting ? 'Exporting...' : 'Export'}
                    </button>

                    <button
                        onClick={onClearOld}
                        disabled={isClearing}
                        className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete old records"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                <DateRangePicker />

                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block" />

                <SelectFilter
                    icon={Filter}
                    value={filters.role}
                    onChange={(val) => onUpdate({ role: val, page: '1' })}
                    options={[
                        { value: 'all', label: 'All Roles' },
                        { value: 'authenticated', label: 'Members' },
                        { value: 'guest', label: 'Guests' },
                        { value: 'anonymous', label: 'Anonymous' },
                        { value: 'admin', label: 'Admins' },
                    ]}
                />

                <SelectFilter
                    icon={Monitor}
                    value={filters.device}
                    onChange={(val) => onUpdate({ device: val, page: '1' })}
                    options={[
                        { value: 'all', label: 'All Devices' },
                        { value: 'Desktop', label: 'Desktop' },
                        { value: 'Mobile', label: 'Mobile' },
                        { value: 'Tablet', label: 'Tablet' },
                    ]}
                />

                <SelectFilter
                    icon={Chrome}
                    value={filters.browser}
                    onChange={(val) => onUpdate({ browser: val, page: '1' })}
                    options={[
                        { value: 'all', label: 'All Browsers' },
                        { value: 'Chrome', label: 'Chrome' },
                        { value: 'Firefox', label: 'Firefox' },
                        { value: 'Safari', label: 'Safari' },
                        { value: 'Edge', label: 'Edge' },
                    ]}
                />

                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer select-none px-3 py-1.5 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 transition-colors">
                    <input
                        type="checkbox"
                        checked={filters.excludeAdmins}
                        onChange={(e) => onUpdate({ excludeAdmins: e.target.checked, page: '1' })}
                        className="rounded text-blue-600 focus:ring-blue-500 bg-transparent"
                    />
                    Exclude Admins
                </label>

                {hasActiveFilters && (
                    <button
                        onClick={onClear}
                        className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors"
                    >
                        <X className="w-3.5 h-3.5" />
                        Clear Filters
                    </button>
                )}
            </div>
        </div>
    )
}

function SelectFilter({ icon: Icon, value, onChange, options }: { icon: any, value: string, onChange: (val: string) => void, options: { value: string, label: string }[] }) {
    return (
        <div className="relative">
            <Icon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-9 pr-8 py-1.5 text-sm border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer appearance-none hover:bg-white dark:hover:bg-gray-700 transition-colors"
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    )
}
