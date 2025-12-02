import Link from 'next/link'

interface RecentCasesTableProps {
    recentCases: any[] | null
}

export default function RecentCasesTable({ recentCases }: RecentCasesTableProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:border-gray-700 dark:bg-gray-800 flex flex-col print:hidden h-full">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Cases</h3>
                <Link href="/dashboard/cases" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 transition-colors">View all</Link>
            </div>
            <div className="overflow-x-auto flex-grow">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700/50 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3 font-medium">#</th>
                            <th scope="col" className="px-6 py-3 font-medium">Title</th>
                            <th scope="col" className="px-6 py-3 font-medium">Status</th>
                            <th scope="col" className="px-6 py-3 font-medium">Date</th>
                            <th scope="col" className="px-6 py-3 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {recentCases?.map((c) => (
                            <tr key={c.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {c.case_number}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="truncate max-w-[200px]" title={c.title}>{c.title}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                        ${c.status === 'New' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' :
                                            c.status === 'Under Investigation' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                                c.status === 'Settled' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                                        <span className={`w-1.5 h-1.5 mr-1.5 rounded-full 
                                            ${c.status === 'New' ? 'bg-indigo-500' :
                                                c.status === 'Under Investigation' ? 'bg-yellow-500' :
                                                    c.status === 'Settled' ? 'bg-green-500' :
                                                        'bg-gray-500'}`}></span>
                                        {c.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                    {new Date(c.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link href={`/dashboard/cases/${c.id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                        Manage
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {(!recentCases || recentCases.length === 0) && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                    <div className="flex flex-col items-center justify-center">
                                        <svg className="w-10 h-10 mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                                        <p>No recent cases found.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
