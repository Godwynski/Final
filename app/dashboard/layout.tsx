import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardShell from '@/components/DashboardShell'
import { getCachedProfile, getCachedNewCasesCount } from './actions'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return redirect('/login')

    const [profile, newCasesCount] = await Promise.all([
        getCachedProfile(user.id),
        getCachedNewCasesCount()
    ])

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
