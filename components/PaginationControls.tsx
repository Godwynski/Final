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

    // Generate page numbers with ellipsis
    const getPageNumbers = () => {
        const pages = []
        const showMax = 5

        if (totalPages <= showMax) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            // Always show first page
            pages.push(1)

            // Calculate start and end of current range
            let start = Math.max(2, currentPage - 1)
            let end = Math.min(totalPages - 1, currentPage + 1)

            // Adjust if near start
            if (currentPage <= 3) {
                end = 4
            }

            // Adjust if near end
            if (currentPage >= totalPages - 2) {
                start = totalPages - 3
            }

            // Add ellipsis before start if needed
            if (start > 2) {
                pages.push('...')
            }

            // Add range
            for (let i = start; i <= end; i++) {
                pages.push(i)
            }

            // Add ellipsis after end if needed
            if (end < totalPages - 1) {
                pages.push('...')
            }

            // Always show last page
            pages.push(totalPages)
        }

        return pages
    }

    return (
        <div className="flex flex-col items-center justify-between p-4 space-y-3 md:flex-row md:space-y-0 md:space-x-4">
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-white">{currentPage}</span> of <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span> Pages
            </span>
            <nav aria-label="Page navigation">
                <ul className="inline-flex items-center -space-x-px text-sm h-8">
                    <li>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!hasPrevPage}
                            className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="sr-only">Previous</span>
                            <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                            </svg>
                        </button>
                    </li>
                    {getPageNumbers().map((page, index) => (
                        <li key={index}>
                            {page === '...' ? (
                                <span className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                                    ...
                                </span>
                            ) : (
                                <button
                                    onClick={() => handlePageChange(page as number)}
                                    aria-current={currentPage === page ? 'page' : undefined}
                                    className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 ${currentPage === page
                                        ? 'z-10 text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                                        : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                                        }`}
                                >
                                    {page}
                                </button>
                            )}
                        </li>
                    ))}
                    <li>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!hasNextPage}
                            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="sr-only">Next</span>
                            <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                            </svg>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    )
}
