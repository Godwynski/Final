'use client'

import { useState } from 'react'
import { SiteVisit, VisitStats, deleteVisit, clearOldVisits } from './actions'
import { toast } from 'sonner'
import {
    Globe,
    Monitor,
    Smartphone,
    Tablet,
    Chrome,
    Trash2,
    RefreshCw,
    Calendar,
    Eye,
    Users,
    TrendingUp,
    Activity,
    UserCheck,
    Filter
} from 'lucide-react'

type VisitsClientProps = {
    initialVisits: SiteVisit[]
    initialStats: VisitStats
    totalCount: number
    currentPage: number
    currentFilter: string
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

export default function VisitsClient({
    initialVisits,
    initialStats,
    totalCount,
    currentPage,
    currentFilter
}: VisitsClientProps) {
    const [visits, setVisits] = useState(initialVisits)
    const [stats] = useState(initialStats)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const [isClearing, setIsClearing] = useState(false)

    const totalPages = Math.ceil(totalCount / 25)

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

    return (
        <div className="space-y-6">
            {/* Main Stats Cards - All Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>

            {/* Top Pages */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" /> Top Pages
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {stats.topPages.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 col-span-5 text-center py-4">No page data yet</p>
                    ) : (
                        stats.topPages.map((p, i) => (
                            <div key={i} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={p.page}>{p.page}</p>
                                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{p.count.toLocaleString()}</p>
                            </div>
                        ))
                    )}
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

            {/* Actions Bar with Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Visit Log</h3>
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                            value={currentFilter}
                            onChange={(e) => window.location.href = `?filter=${e.target.value}`}
                            className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                            <option value="all">All Types</option>
                            <option value="page_view">Page Views</option>
                            <option value="session">Sessions</option>
                            <option value="unique_daily">Daily Unique</option>
                        </select>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" /> Refresh
                    </button>
                    <button
                        onClick={handleClearOld}
                        disabled={isClearing}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <Trash2 className="w-4 h-4" />
                        {isClearing ? 'Clearing...' : 'Clear 30+ days'}
                    </button>
                </div>
            </div>

            {/* Visits Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3">Date/Time</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3">IP Address</th>
                                <th className="px-6 py-3">Page</th>
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
                                        No visits recorded yet
                                    </td>
                                </tr>
                            ) : (
                                visits.map((visit) => (
                                    <tr key={visit.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                {formatDate(visit.visited_at)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${visitTypeColors[visit.visit_type || 'page_view']}`}>
                                                {visitTypeLabels[visit.visit_type || 'page_view']}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-gray-600 dark:text-gray-300">
                                            {visit.ip_address || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-blue-600 dark:text-blue-400 font-medium">
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

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t dark:border-gray-700 flex items-center justify-between">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Showing page {currentPage} of {totalPages} ({totalCount} total)
                        </p>
                        <div className="flex gap-2">
                            <a
                                href={`?page=${Math.max(1, currentPage - 1)}&filter=${currentFilter}`}
                                className={`px-3 py-1 text-sm rounded border dark:border-gray-600 ${currentPage === 1
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                Previous
                            </a>
                            <a
                                href={`?page=${Math.min(totalPages, currentPage + 1)}&filter=${currentFilter}`}
                                className={`px-3 py-1 text-sm rounded border dark:border-gray-600 ${currentPage === totalPages
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                Next
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
