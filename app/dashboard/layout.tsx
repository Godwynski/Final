import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'

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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="print:hidden">
                <Navbar name={profile?.full_name || user.email!} />
                <Sidebar role={profile?.role || 'staff'} email={user.email!} />
            </div>
            <div className="p-4 sm:ml-64 pt-20 print:ml-0 print:pt-0 print:p-0">
                <main className="print:p-0 print:overflow-visible">
                    {children}
                </main>
            </div>
        </div>
    )
}
