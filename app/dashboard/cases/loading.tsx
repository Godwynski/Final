export default function CasesLoading() {
    return (
        <div className="p-4 space-y-6 animate-pulse">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-10 w-32 bg-blue-200 dark:bg-blue-900 rounded"></div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="flex gap-2">
                        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                    <div className="flex justify-between items-center">
                        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded"></div>
                        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-600 rounded"></div>
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded"></div>
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded"></div>
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded"></div>
                        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    </div>
                </div>
                <div className="p-4 space-y-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex justify-between items-center">
                            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
