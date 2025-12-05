import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import PaginationControls from '@/components/PaginationControls'
import DateRangePicker from '@/components/DateRangePicker'
import FilterDropdown from '@/components/FilterDropdown'
import SearchInput from '@/components/SearchInput'
import SortableColumn from '@/components/SortableColumn'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Blotter Cases | Dashboard',
    description: 'Manage and track all reported blotter cases'
}

export default async function CasesPage(props: { searchParams: Promise<{ query?: string, status?: string, type?: string, range?: string, page?: string, sort?: string, order?: string }> }) {
    const searchParams = await props.searchParams
    const query = searchParams.query || ''
    const status = searchParams.status || ''
    const type = searchParams.type || ''
    const range = searchParams.range || '30d'
    const page = Number(searchParams.page) || 1
    const sort = searchParams.sort || 'created_at'
    const order = searchParams.order || 'desc'
    const limit = 10
    const from = (page - 1) * limit
    const to = from + limit - 1

    const supabase = await createClient()

    // Calculate Date Range
    const now = new Date()
    let startDate = new Date()
    let endDate: Date | null = null

    switch (range) {
        case 'this_week':
            const day = now.getDay()
            const diff = now.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
            startDate = new Date(now.setDate(diff))
            startDate.setHours(0, 0, 0, 0)
            break
        case 'this_month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1)
            break
        case 'last_month':
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
            break
        case 'this_quarter':
            const quarter = Math.floor((now.getMonth() + 3) / 3)
            startDate = new Date(now.getFullYear(), (quarter - 1) * 3, 1)
            break
        case 'ytd':
            startDate = new Date(now.getFullYear(), 0, 1)
            break
        case '30d':
            startDate.setDate(now.getDate() - 30)
            break
        case 'all':
            startDate = new Date(0)
            break
        default:
            // Check if range is a year (e.g., "2024")
            if (/^\d{4}$/.test(range)) {
                startDate = new Date(parseInt(range), 0, 1)
                endDate = new Date(parseInt(range), 11, 31, 23, 59, 59)
            }
            break
    }

    const { data: casesData, error } = await supabase
        .rpc('search_cases', {
            p_query: query,
            p_status: status || null,
            p_type: type || null,
            p_start_date: range !== 'all' ? startDate.toISOString() : null,
            p_end_date: endDate ? endDate.toISOString() : null,
            p_limit: limit,
            p_offset: from
        })

    if (error) {
        console.error('Error fetching cases:', error)
        console.error('Error details:', JSON.stringify(error, null, 2))
        console.error('Error message:', error?.message)
        console.error('Error hint:', error?.hint)
        console.error('Error details:', error?.details)
    }

    const cases = casesData || []
    const count = cases.length > 0 ? Number(cases[0].full_count) : 0

    const totalPages = count ? Math.ceil(count / limit) : 1
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return (
        <div className="p-4 space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 shrink-0">
                    <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Blotter Cases</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-2xl">Manage and track all reported cases. Use the filters below to search, sort, and filter records.</p>
                </div>
                <Link
                    href="/dashboard/cases/new"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    New Case
                </Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <SearchInput />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <DateRangePicker />
                        <FilterDropdown
                            label="Status"
                            paramName="status"
                            options={['New', 'Under Investigation', 'Settled', 'Closed', 'Dismissed']}
                        />
                        <FilterDropdown
                            label="Type"
                            paramName="type"
                            options={['Theft', 'Harassment', 'Vandalism', 'Physical Injury', 'Property Damage', 'Public Disturbance', 'Other']}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <SortableColumn label="Case #" sortKey="case_number" />
                                <SortableColumn label="Title" sortKey="title" />
                                <SortableColumn label="Status" sortKey="status" />
                                <SortableColumn label="Incident Date" sortKey="incident_date" />
                                <SortableColumn label="Created At" sortKey="created_at" />
                                <th scope="col" className="px-4 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(cases || []).map((c: any) => (
                                <tr key={c.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        #{c.case_number}
                                    </td>
                                    <td className="px-4 py-3">{c.title}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${c.status === 'New' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300' :
                                            c.status === 'Under Investigation' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                                c.status === 'Settled' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                            }`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">{new Date(c.incident_date).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">{new Date(c.created_at).toLocaleDateString()}</td>
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
