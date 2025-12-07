'use client'

import { useState, useEffect, useCallback } from 'react'
import { SiteVisit, VisitStats, deleteVisit, clearOldVisits, exportVisitsCSV, VisitFilters } from './actions'
import { toast } from 'sonner'
import Link from 'next/link'
import DateRangePicker from '@/components/DateRangePicker'
import {
    Globe, Monitor, Smartphone, Tablet, Chrome,
    Trash2, RefreshCw, Calendar, Eye, TrendingUp,
    Activity, UserCheck, Filter, Search, Download, X,
    ChevronLeft, ChevronRight, Clock, BarChart3,
    ArrowUpDown, ArrowUp, ArrowDown
} from 'lucide-react'

type VisitsClientProps = {
    initialVisits: SiteVisit[]
    initialStats: VisitStats
    totalCount: number
    currentPage: number
    currentLimit: number
    currentRole: string
    currentDevice: string
    currentVisitType: string
    currentSearch: string
    currentStartDate: string
    currentEndDate: string
    currentSortBy: string
    currentSortOrder: string
    currentOs: string
    currentBrowser: string
    currentExcludeAdmins: boolean
}

const visitTypeLabels: Record<string, string> = {
    'page_view': 'Page View',
    'session': 'Session',
    'unique_daily': 'Daily Unique',
}

const visitTypeColors: Record<string, string> = {
    'page_view': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'session': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'unique_daily': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
}

const roleColors: Record<string, string> = {
    'admin': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    'authenticated': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'guest': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'anonymous': 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
}

export default function VisitsClient({
    initialVisits,
    initialStats,
    totalCount,
    currentPage,
    currentLimit,
    currentRole,
    currentDevice,
    currentVisitType,
    currentSearch,
    currentStartDate,
    currentEndDate,
    currentSortBy,
    currentSortOrder,
    currentOs,
    currentBrowser,
    currentExcludeAdmins
}: VisitsClientProps) {
    const [visits, setVisits] = useState(initialVisits)
    const [stats] = useState(initialStats)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const [isClearing, setIsClearing] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [searchInput, setSearchInput] = useState(currentSearch)
    const [autoRefresh, setAutoRefresh] = useState(false)

    // New filter states
    const [selectedOs, setSelectedOs] = useState(currentOs)
    const [selectedBrowser, setSelectedBrowser] = useState(currentBrowser)
    const [excludeAdmins, setExcludeAdmins] = useState(currentExcludeAdmins)

    const hasActiveFilters = currentSearch ||
        (currentRole && currentRole !== 'all') ||
        (currentDevice && currentDevice !== 'all') ||
        (currentOs && currentOs !== 'all') ||
        (currentBrowser && currentBrowser !== 'all') ||
        (currentStartDate || currentEndDate)

    const clearFilters = () => {
        setSearchInput('')
        setSelectedOs('all')
        setSelectedBrowser('all')
        setExcludeAdmins(false)
        updateUrl({
            search: '',
            role: 'all',
            device: 'all',
            os: 'all',
            browser: 'all',
            range: '30d', // Default to 30d
            startDate: '',
            endDate: '',
            page: '1'
        })
    }

    const totalPages = Math.ceil(totalCount / currentLimit)

    // Auto-refresh functionality
    useEffect(() => {
        if (!autoRefresh) return
        const interval = setInterval(() => {
            window.location.reload()
        }, 30000)
        return () => clearInterval(interval)
    }, [autoRefresh])

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== currentSearch) {
                updateUrl({ search: searchInput, page: '1' })
            }
        }, 500)
        return () => clearTimeout(timer)
    }, [searchInput])

    const updateUrl = useCallback((params: Record<string, string | boolean | number>) => {
        const url = new URL(window.location.href)
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '' && value !== 'all') {
                url.searchParams.set(key, String(value))
            } else {
                url.searchParams.delete(key)
            }
        })
        window.location.href = url.toString()
    }, [])

    const handleDelete = async (id: string) => {
        setIsDeleting(id)
        const success = await deleteVisit(id)
        if (success) {
            setVisits(visits.filter(v => v.id !== id))
            toast.success('Visit record deleted')
        } else {
            toast.error('Failed to delete visit record')
        }
        setIsDeleting(null)
    }

    const handleClearOld = async () => {
        if (!confirm('Are you sure you want to delete visits older than 30 days?')) return
        setIsClearing(true)
        const count = await clearOldVisits(30)
        if (count > 0) {
            toast.success(`Deleted ${count} old visit records`)
            window.location.reload()
        } else {
            toast.info('No old records to delete')
        }
        setIsClearing(false)
    }

    const handleExport = async () => {
        setIsExporting(true)
        try {
            const csv = await exportVisitsCSV({
                visitType: currentVisitType,
                role: currentRole,
                device: currentDevice,
                startDate: currentStartDate,
                endDate: currentEndDate,
                search: currentSearch
            })
            if (csv) {
                const blob = new Blob([csv], { type: 'text/csv' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `visits_${new Date().toISOString().split('T')[0]}.csv`
                a.click()
                URL.revokeObjectURL(url)
                toast.success('Export downloaded')
            } else {
                toast.error('Failed to export data')
            }
        } catch {
            toast.error('Export failed')
        }
        setIsExporting(false)
    }

    const handleSort = (column: string) => {
        const newOrder = currentSortBy === column && currentSortOrder === 'desc' ? 'asc' : 'desc'
        updateUrl({ sortBy: column, sortOrder: newOrder })
    }

    const getSortIcon = (column: string) => {
        if (currentSortBy !== column) return <ArrowUpDown className="w-3 h-3 opacity-30" />
        return currentSortOrder === 'asc'
            ? <ArrowUp className="w-3 h-3" />
            : <ArrowDown className="w-3 h-3" />
    }

    const getDeviceIcon = (type: string | null) => {
        switch (type?.toLowerCase()) {
            case 'mobile': return <Smartphone className="w-4 h-4" />
            case 'tablet': return <Tablet className="w-4 h-4" />
            default: return <Monitor className="w-4 h-4" />
        }
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Generate page numbers with ellipsis
    const getPageNumbers = () => {
        const pages: (number | string)[] = []
        const showPages = 5

        if (totalPages <= showPages + 2) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
            pages.push(1)
            if (currentPage > 3) pages.push('...')

            const start = Math.max(2, currentPage - 1)
            const end = Math.min(totalPages - 1, currentPage + 1)

            for (let i = start; i <= end; i++) pages.push(i)

            if (currentPage < totalPages - 2) pages.push('...')
            pages.push(totalPages)
        }

        return pages
    }

    const maxHourCount = Math.max(...stats.hourlyDistribution.map(h => h.count), 1)

    return (
        <div className="space-y-6">
            {/* Main Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Page Views</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPageViews.toLocaleString()}</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400">+{stats.todayPageViews} today</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Sessions</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSessions.toLocaleString()}</p>
                            <p className="text-xs text-green-600 dark:text-green-400">+{stats.todaySessions} today</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <UserCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Unique Daily Visitors</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.uniqueDailyVisitors.toLocaleString()}</p>
                            <p className="text-xs text-purple-600 dark:text-purple-400">+{stats.todayUniqueVisitors} today</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                            <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Avg Daily Views</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgDailyPageViews.toLocaleString()}</p>
                            <p className="text-xs text-orange-600 dark:text-orange-400">per day average</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hourly Distribution + Top Pages */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Hourly Distribution */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5" /> Traffic by Hour
                    </h3>
                    <div className="flex items-end gap-1 h-32">
                        {stats.hourlyDistribution.map((h) => (
                            <div key={h.hour} className="flex-1 flex flex-col items-center group">
                                <div className="relative w-full flex justify-center">
                                    <div
                                        className="w-full max-w-[20px] bg-blue-500 dark:bg-blue-600 rounded-t transition-all group-hover:bg-blue-600 dark:group-hover:bg-blue-500"
                                        style={{ height: `${(h.count / maxHourCount) * 100}%`, minHeight: h.count > 0 ? '4px' : '0' }}
                                        title={`${h.hour}:00 - ${h.count} visits`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                        <span>12am</span>
                        <span>6am</span>
                        <span>12pm</span>
                        <span>6pm</span>
                        <span>11pm</span>
                    </div>
                </div>

                {/* Top Pages */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" /> Top Pages
                    </h3>
                    <div className="space-y-3">
                        {stats.topPages.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No page data yet</p>
                        ) : (
                            stats.topPages.map((p, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-300 truncate flex-1 mr-4" title={p.page}>{p.page}</span>
                                    <span className="text-blue-600 dark:text-blue-400 font-bold">{p.count.toLocaleString()}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Browser & Device Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Chrome className="w-5 h-5" /> Browser Distribution
                    </h3>
                    <div className="space-y-3">
                        {stats.browserStats.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No browser data yet</p>
                        ) : (
                            stats.browserStats.slice(0, 5).map((b, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-300">{b.name}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{ width: `${stats.totalSessions > 0 ? (b.count / stats.totalSessions) * 100 : 0}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-500 w-12 text-right">{b.count}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Monitor className="w-5 h-5" /> Device Distribution
                    </h3>
                    <div className="space-y-3">
                        {stats.deviceStats.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No device data yet</p>
                        ) : (
                            stats.deviceStats.map((d, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                        {getDeviceIcon(d.name)} {d.name}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-green-600 h-2 rounded-full"
                                                style={{ width: `${stats.totalSessions > 0 ? (d.count / stats.totalSessions) * 100 : 0}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-500 w-12 text-right">{d.count}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                    {/* Search */}
                    <div className="relative w-full lg:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search IP, page, or user..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* Role Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                            value={currentRole}
                            onChange={(e) => updateUrl({ role: e.target.value, page: '1' })}
                            className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                            <option value="all">All Roles</option>
                            <option value="authenticated">Members</option>
                            <option value="guest">Guests</option>
                            <option value="anonymous">Anonymous</option>
                            <option value="admin">Admins</option>
                        </select>
                    </div>

                    {/* Device Filter */}
                    <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-gray-400" />
                        <select
                            value={currentDevice}
                            onChange={(e) => updateUrl({ device: e.target.value, page: '1' })}
                            className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                            <option value="all">All Devices</option>
                            <option value="Desktop">Desktop</option>
                            <option value="Mobile">Mobile</option>
                            <option value="Tablet">Tablet</option>
                        </select>
                    </div>

                    {/* Date Presets - Replaced with Shared Picker */}
                    <DateRangePicker />

                    {/* New Filters Row */}
                    <div className="w-full flex flex-wrap gap-4 mt-2 lg:mt-0">
                        {/* OS Filter */}
                        <div className="flex items-center gap-2">
                            <Monitor className="w-4 h-4 text-gray-400" />
                            <select
                                value={selectedOs}
                                onChange={(e) => updateUrl({ os: e.target.value, page: '1' })}
                                className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                            >
                                <option value="all">All OS</option>
                                <option value="Windows">Windows</option>
                                <option value="Mac OS">Mac OS</option>
                                <option value="Linux">Linux</option>
                                <option value="Android">Android</option>
                                <option value="iOS">iOS</option>
                            </select>
                        </div>

                        {/* Browser Filter */}
                        <div className="flex items-center gap-2">
                            <Chrome className="w-4 h-4 text-gray-400" />
                            <select
                                value={selectedBrowser}
                                onChange={(e) => updateUrl({ browser: e.target.value, page: '1' })}
                                className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                            >
                                <option value="all">All Browsers</option>
                                <option value="Chrome">Chrome</option>
                                <option value="Firefox">Firefox</option>
                                <option value="Safari">Safari</option>
                                <option value="Edge">Edge</option>
                            </select>
                        </div>

                        {/* Exclude Admins Toggle */}
                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none bg-gray-50 dark:bg-gray-700/50 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600">
                            <input
                                type="checkbox"
                                checked={excludeAdmins}
                                onChange={(e) => updateUrl({ excludeAdmins: e.target.checked, page: '1' })}
                                className="rounded text-blue-600 focus:ring-blue-500"
                            />
                            Exclude Admins
                        </label>

                        {/* Clear Filters Button */}
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Custom Date Range Removed - Handled by DateRangePicker */}

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={autoRefresh}
                                onChange={(e) => setAutoRefresh(e.target.checked)}
                                className="rounded"
                            />
                            Auto-refresh
                        </label>

                        <button
                            onClick={() => window.location.reload()}
                            className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>

                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 rounded-lg disabled:opacity-50"
                        >
                            <Download className="w-4 h-4" />
                            {isExporting ? 'Export...' : 'Export'}
                        </button>

                        <button
                            onClick={handleClearOld}
                            disabled={isClearing}
                            className="flex items-center gap-2 px-3 py-2 text-sm bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg disabled:opacity-50"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Visits Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => handleSort('visited_at')}>
                                    <div className="flex items-center gap-1">Date/Time {getSortIcon('visited_at')}</div>
                                </th>
                                <th className="px-6 py-3">Visitor</th>
                                <th className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => handleSort('ip_address')}>
                                    <div className="flex items-center gap-1">IP Address {getSortIcon('ip_address')}</div>
                                </th>
                                <th className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => handleSort('page_path')}>
                                    <div className="flex items-center gap-1">Page {getSortIcon('page_path')}</div>
                                </th>
                                <th className="px-6 py-3">Browser</th>
                                <th className="px-6 py-3">Device</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visits.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        <Globe className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                        No visits found
                                    </td>
                                </tr>
                            ) : (
                                visits.map((visit) => (
                                    <tr key={visit.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                                            {formatDate(visit.visited_at)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {visit.visitor_name || 'Anonymous'}
                                                </span>
                                                {visit.visitor_email && (
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {visit.visitor_email}
                                                    </span>
                                                )}
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium w-fit mt-1 ${roleColors[visit.visitor_role || 'anonymous'] || roleColors['anonymous']}`}>
                                                    {visit.visitor_role || 'Anonymous'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-gray-600 dark:text-gray-300">
                                            {visit.ip_address || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-blue-600 dark:text-blue-400 font-medium truncate block max-w-[200px]" title={visit.page_path}>
                                                {visit.page_path}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                            {visit.browser || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                {getDeviceIcon(visit.device_type)}
                                                {visit.device_type || 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleDelete(visit.id)}
                                                disabled={isDeleting === visit.id}
                                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                                                title="Delete record"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Enhanced Pagination */}
                {totalPages > 0 && (
                    <div className="px-6 py-4 border-t dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {((currentPage - 1) * currentLimit) + 1}-{Math.min(currentPage * currentLimit, totalCount)} of {totalCount}
                            </p>
                            <select
                                value={currentLimit}
                                onChange={(e) => updateUrl({ limit: e.target.value, page: '1' })}
                                className="text-sm border border-gray-200 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                            >
                                <option value="10">10 / page</option>
                                <option value="25">25 / page</option>
                                <option value="50">50 / page</option>
                                <option value="100">100 / page</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => updateUrl({ page: String(Math.max(1, currentPage - 1)) })}
                                disabled={currentPage === 1}
                                className="p-2 rounded border dark:border-gray-600 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            {getPageNumbers().map((pageNum, i) => (
                                pageNum === '...' ? (
                                    <span key={i} className="px-2 text-gray-400">...</span>
                                ) : (
                                    <button
                                        key={i}
                                        onClick={() => updateUrl({ page: String(pageNum) })}
                                        className={`min-w-[32px] h-8 rounded border text-sm ${currentPage === pageNum
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                )
                            ))}

                            <button
                                onClick={() => updateUrl({ page: String(Math.min(totalPages, currentPage + 1)) })}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded border dark:border-gray-600 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
