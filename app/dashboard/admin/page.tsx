import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { AdminClient } from './AdminClient'
import { Suspense } from 'react'
import UsersTable from './UsersTable'
import AuditLogsTable from './AuditLogsTable'
import TableSkeleton from './TableSkeleton'

export default async function AdminPage(props: { searchParams: Promise<{ error?: string, message?: string, page?: string }> }) {
    const searchParams = await props.searchParams
    const supabase = await createClient()
    const page = Number(searchParams.page) || 1

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return redirect('/login')

    // Verify Admin Role
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <svg className="mx-auto w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Unauthorized Access</h1>
                    <p className="text-gray-500 mb-4">You do not have permission to view this page.</p>
                    <a href="/dashboard" className="text-blue-600 hover:underline font-medium">Return to Dashboard</a>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                        <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage users, monitor system activity, and configure access permissions</p>
                    </div>
                </div>

                {searchParams.message && (
                    <div className="p-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800" role="alert">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">Success!</span> {searchParams.message}
                        </div>
                    </div>
                )}

                {searchParams.error && (
                    <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800" role="alert">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">Error!</span> {searchParams.error}
                        </div>
                    </div>
                )}

                <AdminClient
                    usersTabContent={
                        <Suspense fallback={<TableSkeleton />}>
                            <UsersTable page={page} />
                        </Suspense>
                    }
                    logsTabContent={
                        <Suspense fallback={<TableSkeleton />}>
                            <AuditLogsTable page={page} />
                        </Suspense>
                    }
                />
            </div>
        </div>
    )
}
