export default function CasesLoading() {
    return (
        <div className="p-4 animate-pulse">
            <div className="flex justify-between items-center mb-6">
                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>

            <div className="mb-6 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="p-4 space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex justify-between items-center">
                            <div className="h-4 w-1/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-4 w-1/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-4 w-1/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-4 w-1/12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
