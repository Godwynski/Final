import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import SearchFilter from './search-filter'

export default async function CasesPage(props: { searchParams: Promise<{ query?: string, status?: string }> }) {
    const searchParams = await props.searchParams
    const supabase = await createClient()
    const query = searchParams.query
    const status = searchParams.status

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

    // 2. Fetch All Cases (We filter in memory to handle complex type matching like Dates and Numbers safely)
    let queryBuilder = supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false })

    const { data: allCases } = await queryBuilder

    // 3. Filter Cases in Memory
    const cases = allCases?.filter(c => {
        // Status Filter
        if (status && status !== 'All' && c.status !== status) {
            return false
        }

        // Query Filter
        if (query) {
            const q = query.toLowerCase()

            // Check if case matches party search
            if (partyCaseIds.includes(c.id)) return true

            // Check text fields
            if (c.title?.toLowerCase().includes(q)) return true
            if (c.description?.toLowerCase().includes(q)) return true
            if (c.incident_location?.toLowerCase().includes(q)) return true

            // Check number (convert to string)
            if (c.case_number?.toString().includes(q)) return true

            // Check date (convert to string)
            // We check multiple formats to be helpful
            const dateStr = new Date(c.incident_date).toLocaleDateString().toLowerCase()
            const fullDateStr = c.incident_date.toLowerCase() // ISO string usually
            if (dateStr.includes(q)) return true
            if (fullDateStr.includes(q)) return true

            return false
        }

        return true
    }) || []

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blotter Cases</h1>
                <Link href="/dashboard/cases/new" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                    New Report
                </Link>
            </div>

            <SearchFilter />

            <div className="bg-white rounded-lg shadow dark:bg-gray-800 overflow-hidden">
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Case #</th>
                                <th scope="col" className="px-6 py-3">Title</th>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Location</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cases?.map((c) => (
                                <tr key={c.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        #{c.case_number}
                                    </td>
                                    <td className="px-6 py-4">{c.title}</td>
                                    <td className="px-6 py-4">{new Date(c.incident_date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">{c.incident_location}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${c.status === 'New' ? 'bg-blue-100 text-blue-800' :
                                            c.status === 'Settled' ? 'bg-green-100 text-green-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/dashboard/cases/${c.id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                            Manage
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {(!cases || cases.length === 0) && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center">No cases found matching your criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
