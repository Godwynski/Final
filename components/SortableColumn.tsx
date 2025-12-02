'use client'

import { useRouter, useSearchParams } from 'next/navigation'

type SortableColumnProps = {
    label: string
    sortKey: string
    className?: string
}

export default function SortableColumn({ label, sortKey, className = '' }: SortableColumnProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const currentSort = searchParams.get('sort')
    const currentOrder = searchParams.get('order')

    const isActive = currentSort === sortKey
    const isAsc = isActive && currentOrder === 'asc'

    const handleClick = () => {
        const params = new URLSearchParams(searchParams.toString())

        if (isActive) {
            if (isAsc) {
                params.set('order', 'desc')
            } else {
                // If currently desc, remove sort to reset or toggle to asc? 
                // Standard pattern: asc -> desc -> remove (or asc)
                // Let's do asc -> desc -> asc for simplicity
                params.set('order', 'asc')
            }
        } else {
            params.set('sort', sortKey)
            params.set('order', 'asc')
        }

        router.push(`?${params.toString()}`)
    }

    return (
        <th
            scope="col"
            className={`px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 group transition-colors ${className}`}
            onClick={handleClick}
        >
            <div className="flex items-center gap-1">
                {label}
                <span className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                    {isActive ? (
                        isAsc ? (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                        ) : (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        )
                    ) : (
                        <svg className="w-3 h-3 opacity-0 group-hover:opacity-50" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                    )}
                </span>
            </div>
        </th>
    )
}
