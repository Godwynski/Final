import Link from 'next/link'

type ActionItemProps = {
    staleCases: any[]
    upcomingHearings: any[]
}

export default function ActionRequired({ staleCases, upcomingHearings }: ActionItemProps) {
    if (staleCases.length === 0 && upcomingHearings.length === 0) return null

    return (
        <div className="bg-white border border-red-200 rounded-lg shadow-sm dark:border-red-900 dark:bg-gray-800 mb-6 overflow-hidden">
            <div className="bg-red-50 dark:bg-red-900/20 px-4 py-3 border-b border-red-100 dark:border-red-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="font-bold text-red-800 dark:text-red-300">Action Required</h3>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Stale Cases Column */}
                {staleCases.length > 0 && (
                    <div>
                        <h4 className="text-xs font-bold uppercase text-gray-500 mb-3 flex items-center gap-2">
                            Stale Cases (&gt;15 Days Idle)
                        </h4>
                        <ul className="space-y-3">
                            {staleCases.map((c) => (
                                <li key={c.id} className="flex justify-between items-start text-sm">
                                    <div>
                                        <Link href={`/dashboard/cases/${c.id}`} className="font-medium text-gray-900 dark:text-white hover:underline block">
                                            #{c.case_number}: {c.title}
                                        </Link>
                                        <p className="text-xs text-gray-500">Last updated: {new Date(c.updated_at).toLocaleDateString()}</p>
                                    </div>
                                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                        {c.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Upcoming Hearings Column */}
                {upcomingHearings.length > 0 && (
                    <div>
                        <h4 className="text-xs font-bold uppercase text-gray-500 mb-3 flex items-center gap-2">
                            Upcoming Hearings (&lt;48 Hours)
                        </h4>
                        <ul className="space-y-3">
                            {upcomingHearings.map((h) => (
                                <li key={h.id} className="flex justify-between items-start text-sm">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {new Date(h.hearing_date).toLocaleString()}
                                        </p>
                                        <Link href={`/dashboard/cases/${h.case_id}`} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                                            Case #{h.cases?.case_number}
                                        </Link>
                                        <p className="text-xs text-gray-500">{h.hearing_type}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}
