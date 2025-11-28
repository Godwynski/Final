import { createClient } from '@/utils/supabase/server'
import UserRow from './UserRow'
import PaginationControls from '@/components/PaginationControls'

export default async function UsersTable({ page = 1 }: { page?: number }) {
    const supabase = await createClient()
    const limit = 10
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
    const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to)

    const totalPages = Math.ceil((count || 0) / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Staff Accounts</h2>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Role</th>
                            <th scope="col" className="px-6 py-3">Created At</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map((u) => (
                            <UserRow key={u.id} user={u} />
                        ))}
                    </tbody>
                </table>
            </div>
            <PaginationControls
                hasNextPage={hasNextPage}
                hasPrevPage={hasPrevPage}
                totalPages={totalPages}
                currentPage={page}
            />
        </div>
    )
}
