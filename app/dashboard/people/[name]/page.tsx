import { getPersonHistory } from '../../actions'
import Link from 'next/link'

export default async function PersonProfile(props: { params: Promise<{ name: string }> }) {
    const params = await props.params
    const name = decodeURIComponent(params.name)
    const history = await getPersonHistory(name)

    // Calculate stats
    const totalCases = history.length
    const asComplainant = history.filter(h => h.role === 'Complainant').length
    const asRespondent = history.filter(h => h.role === 'Respondent').length
    const asWitness = history.filter(h => h.role === 'Witness').length

    return (
        <div className="p-4 space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/dashboard/people" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{name}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Person Profile & Case History</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800 p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Cases</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCases}</p>
                </div>
                <div className="bg-white border border-blue-200 rounded-lg shadow-sm dark:border-blue-900 dark:bg-gray-800 p-4">
                    <p className="text-sm text-blue-600 dark:text-blue-400">As Complainant</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{asComplainant}</p>
                </div>
                <div className="bg-white border border-red-200 rounded-lg shadow-sm dark:border-red-900 dark:bg-gray-800 p-4">
                    <p className="text-sm text-red-600 dark:text-red-400">As Respondent</p>
                    <p className="text-2xl font-bold text-red-700 dark:text-red-300">{asRespondent}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800 p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">As Witness</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{asWitness}</p>
                </div>
            </div>

            {/* Case History Timeline */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800 p-6">
                <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Case History</h2>
                <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-3">
                    {history.map((item, index) => (
                        <li key={index} className="mb-10 ml-6">
                            <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 ${item.role === 'Complainant' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                                    item.role === 'Respondent' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                }`}>
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                                </svg>
                            </span>
                            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        <Link href={`/dashboard/cases/${item.case.id}`} className="hover:underline">
                                            {item.case.title}
                                        </Link>
                                    </h3>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(item.case.incident_date).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="mb-2">
                                    <span className={`text-xs font-medium mr-2 px-2.5 py-0.5 rounded ${item.role === 'Complainant' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                                            item.role === 'Respondent' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                        }`}>
                                        Role: {item.role}
                                    </span>
                                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${item.case.status === 'New' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300' :
                                            item.case.status === 'Settled' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                        }`}>
                                        Status: {item.case.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Case #{item.case.case_number}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    )
}
