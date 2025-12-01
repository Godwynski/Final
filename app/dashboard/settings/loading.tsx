export default function SettingsLoading() {
    return (
        <div className="p-4 animate-pulse">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>

            <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="space-y-4">
                        <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        </div>
    )
}
