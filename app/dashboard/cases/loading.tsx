export default function CasesLoading() {
    return (
        <div className="max-w-6xl mx-auto animate-pulse">
            <div className="flex justify-between items-center mb-8">
                <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>

            {/* Search Filter Skeleton */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6 flex gap-4">
                <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>

            {/* Table Skeleton */}
            <div className="bg-white rounded-lg shadow dark:bg-gray-800 overflow-hidden">
                <div className="p-4 border-b dark:border-gray-700">
                    <div className="grid grid-cols-6 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        ))}
                    </div>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="p-4 grid grid-cols-6 gap-4">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded col-span-1"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
