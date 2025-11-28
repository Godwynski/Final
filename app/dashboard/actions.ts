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
