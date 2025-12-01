/**
 * Empty state component with icon and call-to-action
 */

'use client'

import Link from 'next/link'

interface EmptyStateProps {
    icon: React.ReactNode
    title: string
    description: string
    actionLabel?: string
    actionHref?: string
    onAction?: () => void
}

export default function EmptyState({
    icon,
    title,
    description,
    actionLabel,
    actionHref,
    onAction
}: EmptyStateProps) {
    return (
        <div className="text-center py-12 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <div className="text-gray-400 dark:text-gray-500">
                    {icon}
                </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                {description}
            </p>
            {(actionLabel && (actionHref || onAction)) && (
                actionHref ? (
                    <Link
                        href={actionHref}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {actionLabel}
                    </Link>
                ) : (
                    <button
                        onClick={onAction}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {actionLabel}
                    </button>
                )
            )}
        </div>
    )
}
