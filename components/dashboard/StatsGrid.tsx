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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Cases</h3>
                    {range !== 'all' && (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${totalChange >= 0 ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
                            {totalChange >= 0 ? '+' : ''}{totalChange.toFixed(1)}%
                        </span>
                    )}
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
            </div>

            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active</h3>
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</div>
            </div>

            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Resolved</h3>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.resolved}</div>
            </div>

            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">New</h3>
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.new}</div>
            </div>
        </div>
    )
}
