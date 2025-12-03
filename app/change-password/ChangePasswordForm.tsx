'use client'

import { useState } from 'react'
import { updatePassword } from './actions'
import { PasswordRequirements } from '@/components/PasswordRequirements'
import { toast } from 'sonner'

export default function ChangePasswordForm() {
    const [password, setPassword] = useState('')

    return (
        <form action={async (formData) => {
            const result = await updatePassword(formData)
            if (result?.error) {
                toast.error(result.error)
            }
        }} className="space-y-6">
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Password</label>
                <input
                    type="password"
                    name="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="••••••••"
                />
                <PasswordRequirements password={password} />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm New Password</label>
                <input
                    type="password"
                    name="confirm_password"
                    required
                    minLength={8}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="••••••••"
                />
            </div>

            <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
                Update Password
            </button>
        </form>
    )
}
