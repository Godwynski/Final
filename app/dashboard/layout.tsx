import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardShell from '@/components/DashboardShell'

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

    const { count: newCasesCount } = await supabase
        .from('cases')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'New')

    const userProfile = {
        full_name: profile?.full_name || null,
        email: user.email!,
        role: profile?.role || 'staff',
        newCasesCount: newCasesCount || 0
    }

    return (
        <DashboardShell userProfile={userProfile}>
            {children}
        </DashboardShell>
    )
}
