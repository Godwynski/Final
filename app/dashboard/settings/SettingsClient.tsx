'use client'

import { useState, useEffect } from 'react'
import { updateProfile, changePassword, updateSettings } from './actions'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { PasswordRequirements } from '@/components/PasswordRequirements'

type User = {
    email: string
    full_name: string | null
    role: string
}



export default function SettingsClient({ user, settings }: { user: User, settings: any }) {
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
    const [password, setPassword] = useState('')
    const supabase = createClient()

    // Reset password state when modal closes
    useEffect(() => {
        if (!isPasswordModalOpen) setPassword('')
    }, [isPasswordModalOpen])

    return (
        <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Your personal account details</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsProfileModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900/50 dark:text-blue-400 dark:hover:bg-blue-900 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                        </button>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Full Name</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">{user.full_name || <span className="text-gray-400 italic">Not set</span>}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Email Address</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white break-all">{user.email}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Role</p>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'}`}>
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            {user.role}
                        </span>
                    </div>
                </div>
            </div>

            {/* System Settings Card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-green-50 to-white dark:from-gray-800 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/50">
                                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">System Settings</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Configure global settings for print documents and reports</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsSettingsModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 dark:bg-green-900/50 dark:text-green-400 dark:hover:bg-green-900 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                        </button>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Province</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">{settings?.province || <span className="text-gray-400 italic">Not set</span>}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">City / Municipality</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">{settings?.city_municipality || <span className="text-gray-400 italic">Not set</span>}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Barangay Name</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">{settings?.barangay_name || <span className="text-gray-400 italic">Not set</span>}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Punong Barangay</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">{settings?.punong_barangay || <span className="text-gray-400 italic">Not set</span>}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Barangay Secretary</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">{settings?.barangay_secretary || <span className="text-gray-400 italic">Not set</span>}</p>
                    </div>
                </div>
            </div>


            {/* Security & Preferences */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-orange-50 to-white dark:from-gray-800 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/50">
                            <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Security & Preferences</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your password and account preferences</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded bg-gray-200 dark:bg-gray-600">
                                <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Password</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Update your password securely</p>
                            </div>
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
                            const result = await changePassword(formData)
                            if (result?.error) {
                                toast.error(result.error)
                            } else {
                                toast.success('Password changed successfully')
                                setIsPasswordModalOpen(false)
                            }
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
                                    minLength={8}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
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
