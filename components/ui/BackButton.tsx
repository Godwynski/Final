'use client'

import { useRouter } from 'next/navigation'

export default function BackButton() {
    const router = useRouter()

    return (
        <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white mb-4 transition-colors"
        >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
        </button>
    )
}
