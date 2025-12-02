interface StatsGridProps {
    stats: {
        total: number
        active: number
        resolved: number
        new: number
    }
    range: string
    totalChange: number
}

export default function StatsGrid({ stats, range, totalChange }: StatsGridProps) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm dark:border-gray-700 dark:bg-gray-800 transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Cases</h3>
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.414.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                </div>
                <div className="flex items-baseline justify-between">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
                    {range !== 'all' && (
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${totalChange >= 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                            {totalChange >= 0 ? '+' : ''}{totalChange.toFixed(1)}%
                        </span>
                    )}
                </div>
            </div>

            <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm dark:border-gray-700 dark:bg-gray-800 transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Active Cases</h3>
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.active}</div>
            </div>

            <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm dark:border-gray-700 dark:bg-gray-800 transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Resolved</h3>
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.resolved}</div>
            </div>

            <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm dark:border-gray-700 dark:bg-gray-800 transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">New</h3>
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.new}</div>
            </div>
        </div>
    )
}
