import { createClient } from '@/utils/supabase/server'
import PaginationControls from '@/components/PaginationControls'
import SortableColumn from '@/components/SortableColumn'

export default async function AuditLogsTable({ page, sort = 'created_at', order = 'desc' }: { page: number, sort?: string, order?: string }) {
    const supabase = await createClient()
    const limit = 10
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: logs, count } = await supabase
        .from('audit_logs')
        .select('*, profiles:user_id(email, full_name)', { count: 'exact' })
        .order(sort, { ascending: order === 'asc' })
        .range(from, to)

    const totalPages = Math.ceil((count || 0) / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <SortableColumn label="Date & Time" sortKey="created_at" />
                            <SortableColumn label="User" sortKey="user_id" />
                            <SortableColumn label="Action" sortKey="action" />
                            <SortableColumn label="Details" sortKey="details" />
                        </tr>
                    </thead>
                    <tbody>
                        {logs?.map((log) => (
                            <tr key={log.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4" suppressHydrationWarning>{new Date(log.created_at).toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900 dark:text-white">{log.profiles?.full_name || 'System'}</div>
                                    <div className="text-xs text-gray-500">{log.profiles?.email}</div>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{log.action}</td>
                                <td className="px-6 py-4 text-xs">
                                    {log.details && (
                                        <div className="space-y-1">
                                            {log.details.narrative_action && (
                                                <div>
                                                    <span className="font-semibold text-gray-900 dark:text-white">Action: </span>
                                                    <span className="whitespace-pre-wrap text-gray-600 dark:text-gray-300">{log.details.narrative_action}</span>
                                                </div>
                                            )}
                                            {log.details.old_status && log.details.new_status && (
                                                <div>
                                                    <span className="font-semibold text-gray-900 dark:text-white">Status: </span>
                                                    <span>
                                                        Changed from <span className="font-medium text-gray-800 dark:text-gray-200">{log.details.old_status}</span> to <span className="font-medium text-blue-600 dark:text-blue-400">{log.details.new_status}</span>
                                                    </span>
                                                </div>
                                            )}
                                            {!log.details.narrative_action && (!log.details.old_status || !log.details.new_status) && (
                                                <div className="space-y-1">
                                                    {Object.entries(log.details).map(([key, value]) => {
                                                        const formattedKey = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                                                        return (
                                                            <div key={key}>
                                                                <span className="font-semibold text-gray-900 dark:text-white">{formattedKey}: </span>
                                                                <span className="text-gray-600 dark:text-gray-300">
                                                                    {typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value)}
                                                                </span>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <PaginationControls
                hasNextPage={hasNextPage}
                hasPrevPage={hasPrevPage}
                totalPages={totalPages}
                currentPage={page}
            />
        </div>
    )
}
