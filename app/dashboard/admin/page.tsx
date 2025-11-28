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
                <h1 className="text-2xl font-bold text-red-600">Unauthorized Access</h1>
                <p className="text-gray-500">You do not have permission to view this page.</p>
                <a href="/dashboard" className="mt-4 text-blue-600 hover:underline">Return to Dashboard</a>
            </div>
        )
    }

    return (
        <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
                    <a href="/dashboard" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Back to Dashboard</a>
                </div>

                {searchParams.message && (
                    <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
                        <span className="font-medium">Success!</span> {searchParams.message}
                    </div>
                )}

                {searchParams.error && (
                    <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                        <span className="font-medium">Error!</span> {searchParams.error}
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
