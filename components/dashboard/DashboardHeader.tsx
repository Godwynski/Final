import Link from 'next/link'

interface DashboardHeaderProps {
    userProfile: {
        full_name: string | null
        email: string
    } | null
}

export default function DashboardHeader({ userProfile }: DashboardHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Overview</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Welcome back, <span className="font-medium text-gray-900 dark:text-white">{userProfile?.full_name || userProfile?.email}</span>
                </p>
            </div>
            <div>
                <Link
                    href="/dashboard/cases/new"
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
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
