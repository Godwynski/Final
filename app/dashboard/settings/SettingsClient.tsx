'use client'

import { useState } from 'react'
import { updateProfile, changePassword, updateSettings } from './actions'
import { createClient } from '@/utils/supabase/client'

type User = {
    email: string
    full_name: string | null
    role: string
}

export default function SettingsClient({ user, settings }: { user: User, settings: any }) {
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
    const supabase = createClient()

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

            {/* System Settings Card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">System Settings</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure global settings for print documents and reports.</p>
                    </div>
                    <button
                        onClick={() => setIsSettingsModalOpen(true)}
                        className="text-sm text-blue-600 hover:underline dark:text-blue-400 font-medium"
                    >
                        Edit Settings
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Province</p>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">{settings?.province || 'Not set'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">City / Municipality</p>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">{settings?.city_municipality || 'Not set'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Barangay Name</p>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">{settings?.barangay_name || 'Not set'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Punong Barangay</p>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">{settings?.punong_barangay || 'Not set'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Barangay Secretary</p>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">{settings?.barangay_secretary || 'Not set'}</p>
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

            {/* System Settings Modal */}
            {isSettingsModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md relative max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Edit System Settings</h3>
                        </div>
                        <form action={async (formData) => {
                            // Handle Logo Uploads
                            const uploadLogo = async (file: File, name: string) => {
                                if (!file || file.size === 0) return null
                                const fileExt = file.name.split('.').pop()
                                const fileName = `${name}-${Date.now()}.${fileExt}`
                                const { error: uploadError } = await supabase.storage
                                    .from('branding')
                                    .upload(fileName, file)

                                if (uploadError) {
                                    console.error('Error uploading logo:', uploadError)
                                    return null
                                }

                                const { data: { publicUrl } } = supabase.storage
                                    .from('branding')
                                    .getPublicUrl(fileName)

                                return publicUrl
                            }

                            const barangayLogoFile = formData.get('barangay_logo_file') as File
                            const cityLogoFile = formData.get('city_logo_file') as File

                            if (barangayLogoFile && barangayLogoFile.size > 0) {
                                const url = await uploadLogo(barangayLogoFile, 'barangay-logo')
                                if (url) formData.set('logo_barangay_url', url)
                            }

                            if (cityLogoFile && cityLogoFile.size > 0) {
                                const url = await uploadLogo(cityLogoFile, 'city-logo')
                                if (url) formData.set('logo_city_url', url)
                            }

                            await updateSettings(formData)
                            setIsSettingsModalOpen(false)
                        }} className="p-6 space-y-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Province</label>
                                <input
                                    type="text"
                                    name="province"
                                    defaultValue={settings?.province || ''}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="e.g. Metro Manila"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">City / Municipality</label>
                                <input
                                    type="text"
                                    name="city_municipality"
                                    defaultValue={settings?.city_municipality || ''}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="e.g. Quezon City"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Barangay Name</label>
                                <input
                                    type="text"
                                    name="barangay_name"
                                    defaultValue={settings?.barangay_name || ''}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="e.g. Barangay 123"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Barangay Logo</label>
                                    <div className="flex items-center gap-4 mb-2">
                                        {settings?.logo_barangay_url && (
                                            <div className="relative w-16 h-16 border rounded-lg overflow-hidden group">
                                                <img src={settings.logo_barangay_url} alt="Barangay Logo" className="w-full h-full object-contain" />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const input = document.querySelector('input[name="logo_barangay_url"]') as HTMLInputElement
                                                        if (input) input.value = ''
                                                        // Force re-render or visual update (hacky but works for simple form)
                                                        input.parentElement?.querySelector('img')?.remove()
                                                        input.parentElement?.querySelector('button')?.remove()
                                                    }}
                                                    className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <span className="text-xs">Remove</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        name="barangay_logo_file"
                                        accept="image/*"
                                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                    />
                                    <input type="hidden" name="logo_barangay_url" defaultValue={settings?.logo_barangay_url || ''} />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">City Logo</label>
                                    <div className="flex items-center gap-4 mb-2">
                                        {settings?.logo_city_url && (
                                            <div className="relative w-16 h-16 border rounded-lg overflow-hidden group">
                                                <img src={settings.logo_city_url} alt="City Logo" className="w-full h-full object-contain" />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const input = document.querySelector('input[name="logo_city_url"]') as HTMLInputElement
                                                        if (input) input.value = ''
                                                        input.parentElement?.querySelector('img')?.remove()
                                                        input.parentElement?.querySelector('button')?.remove()
                                                    }}
                                                    className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <span className="text-xs">Remove</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        name="city_logo_file"
                                        accept="image/*"
                                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                    />
                                    <input type="hidden" name="logo_city_url" defaultValue={settings?.logo_city_url || ''} />
                                </div>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Punong Barangay</label>
                                <input
                                    type="text"
                                    name="punong_barangay"
                                    defaultValue={settings?.punong_barangay || ''}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="Full Name"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Barangay Secretary</label>
                                <input
                                    type="text"
                                    name="barangay_secretary"
                                    defaultValue={settings?.barangay_secretary || ''}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="Full Name"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsSettingsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    Save Settings
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
