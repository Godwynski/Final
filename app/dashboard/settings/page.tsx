import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getSettings } from './actions'
import { getCachedProfile } from '../actions'
import SettingsClient from './SettingsClient'

export default async function SettingsPage(props: { searchParams: Promise<{ error?: string, message?: string }> }) {
    const [searchParams, supabase] = await Promise.all([
        props.searchParams,
        createClient()
    ])

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect('/login')

    const [profile, settings] = await Promise.all([
        getCachedProfile(user.id),
        getSettings()
    ])



    const userData = {
        email: user.email!,
        full_name: profile?.full_name || null,
        role: profile?.role || 'staff'
    }

    return (
        <div className="p-4 md:p-6">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your profile, security preferences, and system configuration</p>
                    </div>
                </div>

                {searchParams.message && (
                    <div className="p-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800" role="alert">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">Success!</span> {searchParams.message}
                        </div>
                    </div>
                )}

                {searchParams.error && (
                    <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800" role="alert">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">Error!</span> {searchParams.error}
                        </div>
                    </div>
                )}

                <SettingsClient user={userData} settings={settings} />
            </div>
        </div>
    )
}
