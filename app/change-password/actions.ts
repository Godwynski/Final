'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { redirect } from 'next/navigation'
import { passwordSchema } from '@/utils/validation'

export async function updatePassword(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirm_password') as string

    if (password !== confirmPassword) {
        return { error: 'Passwords do not match' }
    }

    // Validate password strength
    const validation = passwordSchema.safeParse(password)
    if (!validation.success) {
        return { error: validation.error.issues[0].message }
    }

    // Update password using the current user's session to maintain it
    const { error: updateError } = await supabase.auth.updateUser({
        password: password
    })

    if (updateError) {
        return { error: updateError.message }
    }

    const supabaseAdmin = createAdminClient()

    // Update force_password_change flag
    const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({ force_password_change: false })
        .eq('id', user.id)

    if (profileError) {
        // We still redirect to dashboard as password was changed, but log the error
        console.error('Error updating profile flag:', profileError)
    }

    redirect('/dashboard?message=Password updated successfully')
}
