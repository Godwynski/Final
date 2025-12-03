'use client'

import { useState } from 'react'
import { updateProfile } from './actions'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

type User = {
    email: string
    full_name: string | null
    role: string
}

export default function ProfileForm({ user }: { user: User }) {
    const [isLoading, setIsLoading] = useState(false)

    return (
        <div className="w-full">
            <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile Information</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Update your personal account details.</p>
            </div>

            <form action={async (formData) => {
                setIsLoading(true)
                try {
                    await updateProfile(formData)
                    toast.success('Profile updated successfully')
                } catch (error) {
                    toast.error('Failed to update profile')
                } finally {
                    setIsLoading(false)
                }
            }} className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="full_name"
                            id="full_name"
                            defaultValue={user.full_name || ''}
                            placeholder="e.g. Juan Dela Cruz"
                            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500 transition-all shadow-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            defaultValue={user.email}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Email address cannot be changed.</p>
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Role
                        </label>
                        <div className="flex items-center h-[42px]">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${user.role === 'admin'
                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300'
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                                }`}>
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    )
}
