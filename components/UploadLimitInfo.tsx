'use client'

interface UploadLimitInfoProps {
    currentCount: number
    maxCount: number
    maxSizeMB: number
    userType: 'guest' | 'staff'
}

export default function UploadLimitInfo({ currentCount, maxCount, maxSizeMB, userType }: UploadLimitInfoProps) {
    const percentage = (currentCount / maxCount) * 100
    const remaining = maxCount - currentCount
    const isNearLimit = percentage >= 80
    const isAtLimit = currentCount >= maxCount

    // Color coding based on usage
    const getStatusColor = () => {
        if (isAtLimit) return 'text-red-600 dark:text-red-400'
        if (isNearLimit) return 'text-yellow-600 dark:text-yellow-400'
        return 'text-green-600 dark:text-green-400'
    }

    const getProgressColor = () => {
        if (isAtLimit) return 'bg-red-600'
        if (isNearLimit) return 'bg-yellow-500'
        return 'bg-blue-600'
    }

    return (
        <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Upload Limits {userType === 'guest' ? '(Guest)' : '(Staff)'}
                </h4>
                <span className={`text-xs font-bold ${getStatusColor()}`}>
                    {currentCount}/{maxCount} Photos
                </span>
            </div>

            {/* Progress Bar */}
            <div className="relative w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 overflow-hidden">
                <div
                    className={`h-2.5 rounded-full transition-all duration-300 ${getProgressColor()}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
            </div>

            {/* Info Text */}
            <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                    <span>Photos remaining:</span>
                    <span className={`font-semibold ${getStatusColor()}`}>
                        {isAtLimit ? 'Limit reached' : `${remaining} left`}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>Max file size:</span>
                    <span className="font-semibold">{maxSizeMB}MB per file</span>
                </div>
            </div>

            {/* Warning Messages */}
            {isAtLimit && (
                <div className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-700 dark:text-red-400">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>Upload limit reached. Cannot upload more photos.</span>
                </div>
            )}

            {isNearLimit && !isAtLimit && (
                <div className="flex items-start gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-xs text-yellow-700 dark:text-yellow-400">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Approaching upload limit. {remaining} photo{remaining !== 1 ? 's' : ''} remaining.</span>
                </div>
            )}
        </div>
    )
}
