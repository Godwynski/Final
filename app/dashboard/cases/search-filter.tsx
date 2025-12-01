'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { useState, useEffect, useRef } from 'react'

export default function SearchFilter() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState(searchParams.get('query')?.toString() || '')
    const [showAdvanced, setShowAdvanced] = useState(false)

    const paramsRef = useRef(searchParams)

    useEffect(() => {
        paramsRef.current = searchParams
        const query = searchParams.get('query')?.toString() || ''
        if (query !== searchTerm) {
            setSearchTerm(query)
        }

        const hasAdvanced = searchParams.get('incident_type') || searchParams.get('start_date') || searchParams.get('end_date')
        if (hasAdvanced) {
            setShowAdvanced(true)
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
        setSearchTerm('')
        setShowAdvanced(false)
    }

    const hasFilters = searchParams.toString().length > 0
    const advancedFilterCount = [
        searchParams.get('incident_type') && searchParams.get('incident_type') !== 'All',
        searchParams.get('start_date'),
        searchParams.get('end_date')
    ].filter(Boolean).length

    return (
        <div className="mb-6">
            {/* Main Filter Bar */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="p-4">
                    <div className="flex flex-col md:flex-row gap-3">
                        {/* Search Input */}
                        <div className="flex-1">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by case #, title, location, or party..."
                                    value={searchTerm}
                                    onChange={onInputChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="w-full md:w-48">
                            <select
                                value={searchParams.get('status')?.toString() || 'All'}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="All">All Statuses</option>
                                <option value="New">New</option>
                                <option value="Under Investigation">Under Investigation</option>
                                <option value="Hearing Scheduled">Hearing Scheduled</option>
                                <option value="Settled">Settled</option>
                                <option value="Closed">Closed</option>
                                <option value="Dismissed">Dismissed</option>
                                <option value="Referred">Referred</option>
                            </select>
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${showAdvanced || advancedFilterCount > 0
                                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                    }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                                {advancedFilterCount > 0 && (
                                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full dark:bg-blue-500">
                                        {advancedFilterCount}
                                    </span>
                                )}
                            </button>

                            {hasFilters && (
                                <button
                                    onClick={handleReset}
                                    className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Advanced Filters */}
                {showAdvanced && (
                    <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {/* Incident Type */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Incident Type</label>
                                <select
                                    value={searchParams.get('incident_type')?.toString() || 'All'}
                                    onChange={(e) => handleFilterChange('incident_type', e.target.value)}
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="All">All Types</option>
                                    <option value="Theft">Theft</option>
                                    <option value="Harassment">Harassment</option>
                                    <option value="Vandalism">Vandalism</option>
                                    <option value="Physical Injury">Physical Injury</option>
                                    <option value="Property Damage">Property Damage</option>
                                    <option value="Public Disturbance">Public Disturbance</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Start Date */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">From Date</label>
                                <input
                                    type="date"
                                    value={searchParams.get('start_date')?.toString() || ''}
                                    onChange={(e) => handleFilterChange('start_date', e.target.value)}
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>

                            {/* End Date */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">To Date</label>
                                <input
                                    type="date"
                                    value={searchParams.get('end_date')?.toString() || ''}
                                    min={searchParams.get('start_date')?.toString()}
                                    onChange={(e) => handleFilterChange('end_date', e.target.value)}
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
