'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface PaginationControlsProps {
    hasNextPage: boolean
    hasPrevPage: boolean
    totalPages: number
    currentPage: number
}

export default function PaginationControls({
    hasNextPage,
    hasPrevPage,
    totalPages,
    currentPage,
}: PaginationControlsProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', newPage.toString())
        router.push(`?${params.toString()}`)
    }

    return (
        <div className="flex flex-col items-center justify-between p-4 space-y-3 md:flex-row md:space-y-0 md:space-x-4">
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-white">{currentPage}</span> of <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span> Pages
            </span>
            <ul className="inline-flex items-stretch -space-x-px">
                <li>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!hasPrevPage}
                        className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="sr-only">Previous</span>
                        <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!hasNextPage}
                        className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="sr-only">Next</span>
                        <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </li>
            </ul>
        </div>
    )
}
