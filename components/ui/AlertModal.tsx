'use client'

interface AlertModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    message: string
    type?: 'success' | 'error' | 'info'
}

export default function AlertModal({ isOpen, onClose, title, message, type = 'info' }: AlertModalProps) {
    if (!isOpen) return null

    const colors = {
        success: 'text-green-600 dark:text-green-400',
        error: 'text-red-600 dark:text-red-400',
        info: 'text-blue-600 dark:text-blue-400'
    }

    const icons = {
        success: (
            <svg className="w-12 h-12 mx-auto mb-4 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
        ),
        error: (
            <svg className="w-12 h-12 mx-auto mb-4 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        info: (
            <svg className="w-12 h-12 mx-auto mb-4 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transform transition-all scale-100 animate-in zoom-in-95 duration-200">
                <div className="p-6 text-center">
                    {icons[type]}
                    <h3 className={`mb-2 text-xl font-bold ${colors[type]}`}>{title}</h3>
                    <p className="mb-6 text-gray-500 dark:text-gray-400">{message}</p>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center w-full justify-center"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    )
}
