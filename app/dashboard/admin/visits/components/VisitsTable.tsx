'use client'

import { SiteVisit } from '../actions'
import { Monitor, Smartphone, Tablet, Globe, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

type VisitsTableProps = {
    visits: SiteVisit[]
    isLoading?: boolean
    onSort: (column: string) => void
    sortBy: string
    sortOrder: string
    onDelete: (id: string) => void
    deletingId: string | null
}

const roleColors: Record<string, string> = {
    'admin': 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
    'authenticated': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    'guest': 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',
    'anonymous': 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
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

export default function VisitsTable({
    visits,
    onSort,
    sortBy,
    sortOrder,
    onDelete,
    deletingId
}: VisitsTableProps) {
    const getSortIcon = (column: string) => {
        if (sortBy !== column) return <ArrowUpDown className="w-3 h-3 opacity-30 group-hover:opacity-100" />
        return sortOrder === 'asc'
            ? <ArrowUp className="w-3 h-3" />
            : <ArrowDown className="w-3 h-3" />
    }

    const TableHead = ({ id, label }: { id: string, label: string }) => (
        <th
            className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group select-none"
            onClick={() => onSort(id)}
        >
            <div className="flex items-center gap-2">
                {label} {getSortIcon(id)}
            </div>
        </th>
    )

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50/50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                        <tr>
                            <TableHead id="visited_at" label="Time" />
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Visitor</th>
                            <TableHead id="ip_address" label="IP Address" />
                            <TableHead id="page_path" label="Page" />
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tech</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {visits.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-24 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
                                            <Globe className="w-8 h-8 opacity-50" />
                                        </div>
                                        <p className="text-lg font-medium">No visits found</p>
                                        <p className="text-sm opacity-60">Try adjusting your filters or date range</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            visits.map((visit) => (
                                <tr key={visit.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300 font-mono text-xs">
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
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border w-fit mt-1.5 ${roleColors[visit.visitor_role || 'anonymous'] || roleColors['anonymous']}`}>
                                                {(visit.visitor_role || 'Anonymous').toUpperCase()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-gray-600 dark:text-gray-300">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            {visit.ip_address || 'Unknown'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-blue-600 dark:text-blue-400 font-medium truncate block max-w-[200px] hover:underline cursor-pointer" title={visit.page_path}>
                                            {visit.page_path}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col text-xs text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 mb-0.5">
                                                {getDeviceIcon(visit.device_type)} {visit.device_type || 'Unknown'}
                                            </span>
                                            <span>
                                                {visit.browser} on {visit.os}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => onDelete(visit.id)}
                                            disabled={deletingId === visit.id}
                                            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
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
        </div>
    )
}
