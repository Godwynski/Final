'use client'

import { useState } from 'react'
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
    const [goToPage, setGoToPage] = useState('')

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return
        const params = new URLSearchParams(searchParams)
        params.set('page', newPage.toString())
        router.push(`?${params.toString()}`)
    }

    const handleGoToPage = (e: React.FormEvent) => {
        e.preventDefault()
        const page = parseInt(goToPage)
        if (!isNaN(page) && page >= 1 && page <= totalPages) {
            handlePageChange(page)
            setGoToPage('')
        }
    }

    // Generate page numbers with ellipsis
    const getPageNumbers = () => {
        const pages: (number | string)[] = []
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

    if (totalPages <= 1) return null

    return (
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Page info and Go To */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    Page <span className="font-semibold text-gray-900 dark:text-white">{currentPage}</span> of <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span>
                </span>

                {/* Go to page form */}
                <form onSubmit={handleGoToPage} className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Go to:</span>
                    <input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={goToPage}
                        onChange={(e) => setGoToPage(e.target.value)}
                        placeholder="#"
                        className="w-16 h-8 px-2 text-sm text-center border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        className="h-8 px-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                    >
                        Go
                    </button>
                </form>
            </div>

            {/* Navigation buttons */}
            <nav aria-label="Page navigation">
                <ul className="inline-flex items-center -space-x-px text-sm h-8">
                    {/* First page button */}
                    <li>
                        <button
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                            title="First page"
                            className="flex items-center justify-center px-2 h-8 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="sr-only">First</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        </button>
                    </li>

                    {/* Previous button */}
                    <li>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!hasPrevPage}
                            title="Previous page"
                            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="sr-only">Previous</span>
                            <svg className="w-2.5 h-2.5 rtl:rotate-180" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                            </svg>
                        </button>
                    </li>

                    {/* Page numbers */}
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

                    {/* Next button */}
                    <li>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!hasNextPage}
                            title="Next page"
                            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="sr-only">Next</span>
                            <svg className="w-2.5 h-2.5 rtl:rotate-180" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                            </svg>
                        </button>
                    </li>

                    {/* Last page button */}
                    <li>
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            title="Last page"
                            className="flex items-center justify-center px-2 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="sr-only">Last</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

