'use client'

import { useState } from 'react'
import { updateUser, adminResetPassword, deleteUser } from './actions'

type User = {
    id: string
    email: string
    full_name: string | null
    role: string
    created_at: string
}

export default function UserRow({ user }: { user: User }) {
    const [isEditing, setIsEditing] = useState(false)

    if (isEditing) {
        return (
            <tr className="bg-blue-50 border-b dark:bg-gray-700 dark:border-gray-700">
                <td colSpan={5} className="px-6 py-4">
                    <form action={async (formData) => {
                        await updateUser(formData)
                        setIsEditing(false)
                    }} className="flex flex-wrap items-center gap-4">
                        <input type="hidden" name="userId" value={user.id} />

                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-gray-500">Full Name</label>
                            <input
                                type="text"
                                name="full_name"
                                defaultValue={user.full_name || ''}
                                className="p-2 text-sm border rounded dark:bg-gray-600 dark:text-white dark:border-gray-500"
                                placeholder="Full Name"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-gray-500">Role</label>
                            <select
                                name="role"
                                defaultValue={user.role}
                                className="p-2 text-sm border rounded dark:bg-gray-600 dark:text-white dark:border-gray-500"
                            >
                                <option value="staff">Staff</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div className="flex gap-2 mt-4 sm:mt-0">
                            <button type="submit" className="px-3 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-700">Save</button>
                            <button type="button" onClick={() => setIsEditing(false)} className="px-3 py-2 text-sm text-gray-600 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300">Cancel</button>
                        </div>
                    </form>
                </td>
            </tr>
        )
    }

    return (
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.full_name || 'N/A'}</td>
            <td className="px-6 py-4">{user.email}</td>
            <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {user.role}
                </span>
            </td>
            <td className="px-6 py-4">{new Date(user.created_at).toLocaleDateString()}</td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsEditing(true)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>

                    <form action={adminResetPassword} onSubmit={(e) => {
                        if (!confirm('Are you sure you want to reset this user\'s password to "Blotter123!"?')) {
                            e.preventDefault()
                        }
                    }}>
                        <input type="hidden" name="userId" value={user.id} />
                        <button type="submit" className="font-medium text-yellow-600 dark:text-yellow-500 hover:underline">Reset Pass</button>
                    </form>

                    <form action={deleteUser} onSubmit={(e) => {
                        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
                            e.preventDefault()
                        }
                    }}>
                        <input type="hidden" name="userId" value={user.id} />
                        <button type="submit" className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                    </form>
                </div>
            </td>
        </tr>
    )
}
