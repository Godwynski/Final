import { createClient } from '@/utils/supabase/server'
import PaginationControls from '@/components/PaginationControls'

export default async function AuditLogsTable({ page = 1 }: { page?: number }) {
    const supabase = await createClient()
    const limit = 10
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { count } = await supabase.from('audit_logs').select('*', { count: 'exact', head: true })
    const { data: logs } = await supabase
        .from('audit_logs')
        .select('*, profiles:user_id(email, full_name)')
        .order('created_at', { ascending: false })
        .range(from, to)

    const totalPages = Math.ceil((count || 0) / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">System Audit Logs</h2>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Date & Time</th>
                            <th scope="col" className="px-6 py-3">User</th>
                            <th scope="col" className="px-6 py-3">Action</th>
                            <th scope="col" className="px-6 py-3">Details</th>
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
                                                        // Skip internal keys if we decide to hide them, but for now show all
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
