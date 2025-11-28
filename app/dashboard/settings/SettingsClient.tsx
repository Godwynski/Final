'use client'

import { useState } from 'react'
import { updateProfile, changePassword } from './actions'

type User = {
    email: string
    full_name: string | null
    role: string
}

export default function SettingsClient({ user }: { user: User }) {
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

    return (
        <div className="space-y-8">
            {/* Profile Card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6">
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
                    <button
                        onClick={() => setIsProfileModalOpen(true)}
                        className="text-sm text-blue-600 hover:underline dark:text-blue-400 font-medium"
                    >
                        Edit Profile
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Full Name</p>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">{user.full_name || 'Not set'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email Address</p>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">{user.email}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Role</p>
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'}`}>
                            {user.role}
                        </span>
                    </div>
                </div>
            </div>

            {/* Security & Preferences */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Security & Preferences</h2>

                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">Password</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Update your password securely</p>
                        </div>
                        <button
                            onClick={() => setIsPasswordModalOpen(true)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                        >
                            Change Password
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isProfileModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md relative">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Profile</h3>
                        </div>
                        <form action={async (formData) => {
                            await updateProfile(formData)
                            setIsProfileModalOpen(false)
                        }} className="p-6 space-y-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full Name</label>
                                <input
                                    type="text"
                                    name="full_name"
                                    defaultValue={user.full_name || ''}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsProfileModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md relative">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Change Password</h3>
                        </div>
                        <form action={async (formData) => {
                            await changePassword(formData)
                            setIsPasswordModalOpen(false)
                        }} className="p-6 space-y-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Current Password</label>
                                <input
                                    type="password"
                                    name="current_password"
                                    required
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    minLength={6}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirm_password"
                                    required
                                    minLength={6}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsPasswordModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                >
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
