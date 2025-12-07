export default function VisitsLoading() {
    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <div className="space-y-6">
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="flex-1 space-y-2">
                        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                </div>

                {/* Stats Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                                <div className="space-y-2">
                                    <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Table Skeleton */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="p-4 border-b dark:border-gray-700">
                        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                    <div className="divide-y dark:divide-gray-700">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="p-4 flex gap-4">
                                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
