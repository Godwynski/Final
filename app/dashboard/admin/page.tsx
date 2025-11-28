import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { createUser, deleteUser, updateUserRole } from './actions'
import RoleSelector from './RoleSelector'

export default async function AdminPage(props: { searchParams: Promise<{ error?: string }> }) {
    const searchParams = await props.searchParams
    const supabase = await createClient()

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

    // Fetch Users (Profiles)
    const { data: users } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })

    // Fetch Audit Logs
    const { data: logs } = await supabase.from('audit_logs').select('*, profiles:user_id(email)').order('created_at', { ascending: false }).limit(50)

    return (
        <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
                    <a href="/dashboard" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Back to Dashboard</a>
                </div>

                {searchParams.error && (
                    <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                        <span className="font-medium">Error!</span> {searchParams.error}
                    </div>
                )}

                {/* User Management Section */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">User Management</h2>

                    {/* Create User Form */}
                    <div className="mb-8 p-4 border border-gray-200 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                        <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Create New Staff Account</h3>
                        <form action={createUser} className="flex flex-wrap gap-4 items-end">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                <input type="email" name="email" required className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white" placeholder="staff@example.com" />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" name="password" required className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white" placeholder="••••••••" />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role</label>
                                <select name="role" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white">
                                    <option value="staff">Staff</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Create User</button>
                        </form>
                    </div>

                    {/* Users Table */}
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Email</th>
                                    <th scope="col" className="px-6 py-3">Role</th>
                                    <th scope="col" className="px-6 py-3">Created At</th>
                                    <th scope="col" className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users?.map((u) => (
                                    <tr key={u.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <form action={updateUserRole} className="flex items-center gap-2">
                                                <input type="hidden" name="userId" value={u.id} />
                                                <RoleSelector defaultValue={u.role} />
                                            </form>
                                        </td>
                                        <td className="px-6 py-4">{new Date(u.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <form action={deleteUser} className="inline-block">
                                                <input type="hidden" name="userId" value={u.id} />
                                                <button type="submit" className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                                            </form>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Audit Logs Section */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">System Audit Logs</h2>
                    <div className="relative overflow-x-auto max-h-[400px]">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Date & Time</th>
                                    <th scope="col" className="px-6 py-3">User</th>
                                    <th scope="col" className="px-6 py-3">Action</th>
                                    <th scope="col" className="px-6 py-3">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs?.map((log) => (
                                    <tr key={log.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td className="px-6 py-4">{new Date(log.created_at).toLocaleString()}</td>
                                        <td className="px-6 py-4">{log.profiles?.email || 'System'}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{log.action}</td>
                                        <td className="px-6 py-4 font-mono text-xs">{JSON.stringify(log.details)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    )
}
