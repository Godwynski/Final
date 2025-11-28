import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Dashboard() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    const { data: cases, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching cases:', error)
    }

    const totalCases = cases?.length || 0
    const newCases = cases?.filter(c => c.status === 'New').length || 0
    const pendingCases = cases?.filter(c => c.status === 'Under Investigation').length || 0
    const settledCases = cases?.filter(c => c.status === 'Settled').length || 0
    const closedCases = cases?.filter(c => c.status === 'Closed').length || 0

    const activeCases = newCases + pendingCases
    const resolvedCases = settledCases + closedCases

    // Calculate New This Month
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const newThisMonth = cases?.filter(c => new Date(c.created_at) >= startOfMonth).length || 0

    // Calculate percentages for the distribution bar
    const getPercent = (count: number) => totalCases > 0 ? (count / totalCases) * 100 : 0

    return (
        <div className="p-4">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Welcome back, <span className="font-semibold text-gray-900 dark:text-white">{profile?.email}</span>
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <Link
                        href="/dashboard/cases/new"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 inline-flex items-center"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        New Case
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-normal text-gray-500 dark:text-gray-400">Total Cases</h3>
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900">
                            <svg className="w-4 h-4 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.414.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalCases}</div>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-normal text-gray-500 dark:text-gray-400">Active Cases</h3>
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900">
                            <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{activeCases}</div>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-normal text-gray-500 dark:text-gray-400">Resolved</h3>
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900">
                            <svg className="w-4 h-4 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{resolvedCases}</div>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-normal text-gray-500 dark:text-gray-400">New This Month</h3>
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900">
                            <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{newThisMonth}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Recent Cases Table */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Cases</h3>
                        <Link href="/dashboard/cases" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">View all</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-4 py-3">Case ID</th>
                                    <th scope="col" className="px-4 py-3">Title</th>
                                    <th scope="col" className="px-4 py-3">Status</th>
                                    <th scope="col" className="px-4 py-3">Date</th>
                                    <th scope="col" className="px-4 py-3">
                                        <span className="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {cases?.slice(0, 5).map((c) => (
                                    <tr key={c.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            #{c.case_number}
                                        </td>
                                        <td className="px-4 py-3">
                                            {c.title}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full 
                                                ${c.status === 'New' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300' :
                                                    c.status === 'Under Investigation' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                                        c.status === 'Settled' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {new Date(c.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link href={`/dashboard/cases/${c.id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                                Manage
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {(!cases || cases.length === 0) && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                                            No cases found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Case Distribution */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800 p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Case Distribution</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">New</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{Math.round(getPercent(newCases))}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${getPercent(newCases)}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">Under Investigation</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{Math.round(getPercent(pendingCases))}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${getPercent(pendingCases)}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">Settled</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{Math.round(getPercent(settledCases))}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${getPercent(settledCases)}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">Closed</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{Math.round(getPercent(closedCases))}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div className="bg-gray-500 h-2.5 rounded-full" style={{ width: `${getPercent(closedCases)}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                        <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">Did you know?</h4>
                        <p className="text-xs text-blue-700 dark:text-blue-400">
                            You can generate secure upload links for guests to upload evidence directly to a case without logging in.
                        </p>
                        <Link href="/dashboard/cases" className="mt-2 inline-block text-xs font-medium text-blue-600 hover:underline dark:text-blue-500">
                            Go to Cases &rarr;
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
