export default function TableSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow animate-pulse">
            <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 w-1/4 mb-6"></div>
            <div className="space-y-4">
                <div className="flex gap-4">
                    <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-1/5"></div>
                    <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-1/5"></div>
                    <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-1/5"></div>
                    <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-1/5"></div>
                    <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-1/5"></div>
                </div>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-100 rounded dark:bg-gray-700/50 w-full"></div>
                ))}
            </div>
        </div>
    )
}
