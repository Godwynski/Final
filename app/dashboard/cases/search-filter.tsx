'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

export default function SearchFilter() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set('query', term)
        } else {
            params.delete('query')
        }
        router.replace(`/dashboard/cases?${params.toString()}`)
    }, 300)

    const handleStatusChange = (status: string) => {
        const params = new URLSearchParams(searchParams)
        if (status && status !== 'All') {
            params.set('status', status)
        } else {
            params.delete('status')
        }
        router.replace(`/dashboard/cases?${params.toString()}`)
    }

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex-1">
                <label htmlFor="search" className="sr-only">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        id="search"
                        className="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search cases, parties, or case #..."
                        defaultValue={searchParams.get('query')?.toString()}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
            </div>
            <div className="w-full md:w-48">
                <select
                    id="status"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    defaultValue={searchParams.get('status')?.toString() || 'All'}
                    onChange={(e) => handleStatusChange(e.target.value)}
                >
                    <option value="All">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Under Investigation">Under Investigation</option>
                    <option value="Settled">Settled</option>
                    <option value="Closed">Closed</option>
                </select>
            </div>
        </div>
    )
}
