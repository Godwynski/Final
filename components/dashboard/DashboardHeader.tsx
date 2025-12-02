import Link from 'next/link'

interface DashboardHeaderProps {
    userProfile: {
        full_name: string | null
        email: string
    } | null
}

export default function DashboardHeader({ userProfile }: DashboardHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden mb-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Welcome back, <span className="font-semibold text-gray-900 dark:text-white">{userProfile?.full_name || userProfile?.email}</span>
                </p>
            </div>
            <div>
                <Link
                    href="/dashboard/cases/new"
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 transition-colors shadow-sm"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    New Case
                </Link>
            </div>
        </div>
    )
}
