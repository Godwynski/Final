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

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value && value !== 'All') {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        router.replace(`/dashboard/cases?${params.toString()}`)
    }

    return (
        <div className="flex flex-col gap-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-4">
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
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="New">New</option>
                        <option value="Under Investigation">Under Investigation</option>
                        <option value="Settled">Settled</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                <div className="w-full md:w-48">
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
                <div className="w-full md:w-48">
                    <label htmlFor="start_date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Start Date</label>
                    <input
                        type="date"
                        id="start_date"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        defaultValue={searchParams.get('start_date')?.toString()}
                        onChange={(e) => handleFilterChange('start_date', e.target.value)}
                    />
                </div>
                <div className="w-full md:w-48">
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
        </div>
    )
}
