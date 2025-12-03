'use client'

import Image from 'next/image'

import { updateSettings } from './actions'
import { createClient } from '@/utils/supabase/client'

interface SettingsModalProps {
    settings: any
    onClose: () => void
}

export default function SettingsModal({ settings, onClose }: SettingsModalProps) {
    const supabase = createClient()

    return (
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
                    onClose()
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
                                        <Image src={settings.logo_barangay_url} alt="Barangay Logo" fill className="object-contain" sizes="64px" />
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
                                        <Image src={settings.logo_city_url} alt="City Logo" fill className="object-contain" sizes="64px" />
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
                            onClick={onClose}
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
    )
}
