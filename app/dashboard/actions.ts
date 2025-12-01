'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function generateGuestLink(formData: FormData) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const durationHours = parseInt(formData.get('duration') as string)
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + durationHours)

    // Simple token generation (could be more robust)
    const token = crypto.randomUUID()

    const { error } = await supabase.from('guest_links').insert({
        token,
        created_by: user.id,
        expires_at: expiresAt.toISOString(),
        is_active: true,
    })

    if (error) {
        console.error('Error creating link:', error)
        // Handle error
    }

    revalidatePath('/dashboard')
}

export async function getAnalyticsData() {
    const supabase = await createClient()
    const { data, error } = await supabase.rpc('get_analytics_summary')

    if (error || !data) {
        console.error('Error fetching analytics:', error)
        return { statusData: [], typeData: [], trendData: [] }
    }

    // data is already in the correct format { statusData, typeData, trendData }
    // but returned as JSON, so we might need to cast or just return it if it matches
    // The RPC returns a JSON object with keys matching our expected output.
    return data as {
        statusData: { name: string; value: number }[]
        typeData: { name: string; value: number }[]
        trendData: { name: string; cases: number }[]
    }
}
