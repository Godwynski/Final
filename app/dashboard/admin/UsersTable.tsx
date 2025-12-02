import { createClient } from '@/utils/supabase/server'
import UserRow from './UserRow'
import PaginationControls from '@/components/PaginationControls'
import SortableColumn from '@/components/SortableColumn'

export default async function UsersTable({ page, sort = 'created_at', order = 'desc' }: { page: number, sort?: string, order?: string }) {
    const supabase = await createClient()
    const limit = 10
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: users, count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .order(sort, { ascending: order === 'asc' })
        .range(from, to)

    const totalPages = Math.ceil((count || 0) / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <SortableColumn label="Email" sortKey="email" />
                            <SortableColumn label="Full Name" sortKey="full_name" />
                            <SortableColumn label="Role" sortKey="role" />
                            <SortableColumn label="Last Sign In" sortKey="last_sign_in_at" />
                            <SortableColumn label="Created At" sortKey="created_at" />
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
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
