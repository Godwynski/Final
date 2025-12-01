'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { useState, useEffect, useRef } from 'react'

export default function SearchFilter() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState(searchParams.get('query')?.toString() || '')

    // Keep a ref to searchParams to avoid stale closures in the debounced callback
    const paramsRef = useRef(searchParams)

    // Update ref when searchParams changes
    useEffect(() => {
        paramsRef.current = searchParams
        // Sync local state with URL params (e.g. on Reset)
        const query = searchParams.get('query')?.toString() || ''
        if (query !== searchTerm) {
            setSearchTerm(query)
        }
    }, [searchParams])

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(paramsRef.current)
        if (term) {
            params.set('query', term)
        } else {
            params.delete('query')
        }
        router.replace(`/dashboard/cases?${params.toString()}`)
    }, 300)

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchTerm(value)
        handleSearch(value)
    }

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value && value !== 'All') {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        router.replace(`/dashboard/cases?${params.toString()}`)
    }

    const handleReset = () => {
        router.replace('/dashboard/cases')
        setSearchTerm('') // Clear local state immediately for better UX
    }

    const hasFilters = searchParams.toString().length > 0

    return (
        <div className="p-4 mb-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 md:grid-cols-2">
                {/* Search Input */}
                <div className="lg:col-span-4">
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
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Search cases, parties, or case #..."
                            value={searchTerm}
                            onChange={onInputChange}
                        />
                    </div>
                </div>

                {/* Status Filter */}
                <div>
                    <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status</label>
                    <select
                        id="status"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        defaultValue={searchParams.get('status')?.toString() || 'All'}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="New">New</option>
                        <option value="Under Investigation">Under Investigation</option>
                        <option value="Settled">Settled</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>

                {/* Incident Type Filter */}
                <div>
                    <label htmlFor="incident_type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Incident Type</label>
                    <select
                        id="incident_type"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        defaultValue={searchParams.get('incident_type')?.toString() || 'All'}
                        onChange={(e) => handleFilterChange('incident_type', e.target.value)}
                    >
                        <option value="All">All Types</option>
                        <option value="Theft">Theft</option>
                        <option value="Physical Injury">Physical Injury</option>
                        <option value="Property Damage">Property Damage</option>
                        <option value="Noise Complaint">Noise Complaint</option>
                        <option value="Dispute">Dispute</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {/* Start Date Filter */}
                <div>
                    <label htmlFor="start_date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Start Date</label>
                    <input
                        type="date"
                        id="start_date"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        defaultValue={searchParams.get('start_date')?.toString()}
                        onChange={(e) => handleFilterChange('start_date', e.target.value)}
                    />
                </div>

                {/* End Date Filter */}
                <div>
                    <label htmlFor="end_date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">End Date</label>
                    <input
                        type="date"
                        id="end_date"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        defaultValue={searchParams.get('end_date')?.toString()}
                        onChange={(e) => handleFilterChange('end_date', e.target.value)}
                    />
                </div>
            </div>

            {hasFilters && (
                <div className="flex justify-end mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={handleReset}
                        className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                    >
                        Reset Filters
                    </button>
                </div>
            )}
        </div>
    )
}
