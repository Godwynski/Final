import { getPeople } from '../actions'
import Link from 'next/link'
import SearchInput from '@/components/SearchInput'
import PaginationControls from '@/components/PaginationControls'
import SortableColumn from '@/components/SortableColumn'

export default async function PeopleDirectory(props: { searchParams: Promise<{ query?: string, page?: string, sort?: string, order?: string }> }) {
    const searchParams = await props.searchParams
    const query = searchParams.query || ''
    const page = Number(searchParams.page) || 1
    const sort = searchParams.sort || 'name'
    const order = searchParams.order || 'asc'
    const limit = 10

    const { people, total } = await getPeople(query, page, limit, sort, order)
    const totalPages = Math.ceil(total / limit)

    // Client-side sort of the aggregated page (since getPeople returns a slice, we might need to sort the slice or sort all then slice in action)
    // Actually, getPeople does aggregation then slicing. 
    // To sort properly, we should sort the 'allPeople' array in getPeople BEFORE slicing.
    // I will update getPeople again to handle sorting before slicing.

    return (
        <div className="p-4 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">People Directory</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Individuals involved in blotter cases.
                    </p>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800 p-4">
                <div className="max-w-md">
                    <SearchInput />
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <SortableColumn label="Name" sortKey="name" />
                                <th scope="col" className="px-6 py-3">Roles</th>
                                <th scope="col" className="px-6 py-3">Contact</th>
                                <SortableColumn label="Total Cases" sortKey="caseCount" />
                                <SortableColumn label="Last Active" sortKey="lastActive" />
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {people.map((person, index) => (
                                <tr key={index} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {person.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {person.roles.map(role => (
                                                <span key={role} className={`px-2 py-0.5 rounded text-xs font-medium border ${role === 'Complainant' ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300' :
                                                    role === 'Respondent' ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300' :
                                                        'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300'
                                                    }`}>
                                                    {role}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {person.contact || <span className="text-gray-400 italic">N/A</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-gray-900 dark:text-white">{person.caseCount}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(person.lastActive).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/dashboard/people/${encodeURIComponent(person.name)}`}
                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                        >
                                            View History
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {people.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                        No people found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <PaginationControls
                    hasNextPage={page < totalPages}
                    hasPrevPage={page > 1}
                    totalPages={totalPages}
                    currentPage={page}
                />
            </div>
        </div>
    )
}
