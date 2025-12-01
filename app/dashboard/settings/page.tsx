import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getSettings } from './actions'
import SettingsClient from './SettingsClient'

export default async function SettingsPage(props: { searchParams: Promise<{ error?: string, message?: string }> }) {
    const searchParams = await props.searchParams
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    const settings = await getSettings()

    const userData = {
        email: user.email!,
        full_name: profile?.full_name || null,
        role: profile?.role || 'staff'
    }

    return (
        <div className="p-4">
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>

                {searchParams.message && (
                    <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
                        <span className="font-medium">Success!</span> {searchParams.message}
                    </div>
                )}

                {searchParams.error && (
                    <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                        <span className="font-medium">Error!</span> {searchParams.error}
                    </div>
                )}

                <SettingsClient user={userData} settings={settings} />
            </div>
        </div>
    )
}
