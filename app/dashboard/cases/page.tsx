import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import SearchFilter from './search-filter'

import PaginationControls from '@/components/PaginationControls'

export default async function CasesPage(props: { searchParams: Promise<{ query?: string, status?: string, incident_type?: string, start_date?: string, end_date?: string, page?: string }> }) {
    const searchParams = await props.searchParams
    const supabase = await createClient()
    const query = searchParams.query
    const status = searchParams.status
    const incidentType = searchParams.incident_type
    const startDate = searchParams.start_date
    const endDate = searchParams.end_date
    const page = Number(searchParams.page) || 1
    const limit = 10
    const from = (page - 1) * limit
    const to = from + limit - 1

    let partyCaseIds: string[] = []

    // 1. Search Involved Parties (DB Side - Text fields only)
    if (query) {
        const { data: partyData } = await supabase
            .from('involved_parties')
            .select('case_id')
            .or(`name.ilike.%${query}%,contact_number.ilike.%${query}%,address.ilike.%${query}%`)

        if (partyData) {
            partyCaseIds = partyData.map(p => p.case_id)
        }
    }

    // 2. Build Main Query with DB-side Pagination and Filtering
    let queryBuilder = supabase
        .from('cases')
        .select('id, case_number, title, incident_date, incident_location, status', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

    // Apply Filters
    if (status && status !== 'All') {
        queryBuilder = queryBuilder.eq('status', status)
    }

    if (incidentType && incidentType !== 'All') {
        queryBuilder = queryBuilder.eq('incident_type', incidentType)
    }

    if (startDate) {
        queryBuilder = queryBuilder.gte('incident_date', new Date(startDate).toISOString())
    }

    if (endDate) {
        // Set to end of day
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        queryBuilder = queryBuilder.lte('incident_date', end.toISOString())
    }

    // Apply Search
    if (query) {
        const orConditions = [
            `title.ilike.%${query}%`,
            `description.ilike.%${query}%`,
            `incident_location.ilike.%${query}%`
        ]

        // Add party matches if any
        if (partyCaseIds.length > 0) {
            orConditions.push(`id.in.(${partyCaseIds.join(',')})`)
        }

        // Try to match case number if query is numeric
        if (!isNaN(Number(query))) {
            orConditions.push(`case_number.eq.${query}`)
        }

        queryBuilder = queryBuilder.or(orConditions.join(','))
    }

    const { data: cases, count } = await queryBuilder

    // 3. Pagination Calculations
    const totalItems = count || 0
    const totalPages = Math.ceil(totalItems / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return (
        <div className="p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blotter Cases</h1>
                <Link href="/dashboard/cases/new" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 inline-flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    New Report
                </Link>
            </div>

            <SearchFilter />

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-4 py-3">Case #</th>
                                <th scope="col" className="px-4 py-3">Title</th>
                                <th scope="col" className="px-4 py-3">Date</th>
                                <th scope="col" className="px-4 py-3">Location</th>
                                <th scope="col" className="px-4 py-3">Status</th>
                                <th scope="col" className="px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(cases || []).map((c) => (
                                <tr key={c.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        #{c.case_number}
                                    </td>
                                    <td className="px-4 py-3">{c.title}</td>
                                    <td className="px-4 py-3">{new Date(c.incident_date).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">{c.incident_location}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${c.status === 'New' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300' :
                                            c.status === 'Under Investigation' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                                c.status === 'Settled' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                            }`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Link href={`/dashboard/cases/${c.id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                            Manage
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {(cases || []).length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">No cases found matching your criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <PaginationControls
                    hasNextPage={hasNextPage}
                    hasPrevPage={hasPrevPage}
                    totalPages={totalPages}
                    currentPage={page}
                />
            </div>
        </div>
    )
}
