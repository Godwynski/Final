/**
 * Reusable confirmation dialog component
 * Prevents accidental deletion and data loss
 */

'use client'

import { useState } from 'react'

interface ConfirmDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'warning' | 'info'
}

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger'
}: ConfirmDialogProps) {
    const [isLoading, setIsLoading] = useState(false)

    if (!isOpen) return null

    const handleConfirm = async () => {
        setIsLoading(true)
        await onConfirm()
        setIsLoading(false)
        onClose()
    }

    const variantStyles = {
        danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700',
        warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-300 dark:bg-yellow-600 dark:hover:bg-yellow-700',
        info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700'
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative">
                    {/* Icon */}
                    <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 ${variant === 'danger' ? 'bg-red-100 dark:bg-red-900' :
                            variant === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900' :
                                'bg-blue-100 dark:bg-blue-900'
                        }`}>
                        <svg className={`h-6 w-6 ${variant === 'danger' ? 'text-red-600 dark:text-red-300' :
                                variant === 'warning' ? 'text-yellow-600 dark:text-yellow-300' :
                                    'text-blue-600 dark:text-blue-300'
                            }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                        {message}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 disabled:opacity-50"
                        >
                            {cancelText}
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={isLoading}
                            className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-4 disabled:opacity-50 ${variantStyles[variant]}`}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Processing...
                                </span>
                            ) : confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
