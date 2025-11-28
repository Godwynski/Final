export default function DashboardLoading() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="mt-4 sm:mt-0">
                    <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Cases Table Skeleton */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="p-6 space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="h-4 w-1/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Case Distribution Skeleton */}
                <div className="space-y-8">
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                        <div className="space-y-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i}>
                                    <div className="flex justify-between mb-1">
                                        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                        <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
