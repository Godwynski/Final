'use client'

export default function RoleSelector({ defaultValue }: { defaultValue: string }) {
    return (
        <select
            name="role"
            defaultValue={defaultValue}
            onChange={(e) => e.target.form?.requestSubmit()}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
        </select>
    )
}
