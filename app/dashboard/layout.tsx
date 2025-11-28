import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import NotificationBell from '@/components/NotificationBell'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (profile?.force_password_change) {
        redirect('/change-password')
    }

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar role={profile?.role || 'staff'} email={user.email!} />
            <div className="flex-1 flex flex-col h-screen overflow-hidden print:h-auto print:overflow-visible">
                <header className="bg-white dark:bg-gray-800 shadow-sm z-10 p-4 flex justify-end items-center print:hidden">
                    <NotificationBell />
                </header>
                <main className="flex-1 overflow-y-auto p-8 print:p-0 print:overflow-visible">
                    {children}
                </main>
            </div>
        </div>
    )
}
