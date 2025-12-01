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
        redirect('/change-password?error=Passwords do not match')
    }

    // Validate password strength
    const validation = passwordSchema.safeParse(password)
    if (!validation.success) {
        redirect(`/change-password?error=${encodeURIComponent(validation.error.issues[0].message)}`)
    }

    const supabaseAdmin = createAdminClient()

    // Update password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
        password: password
    })

    if (updateError) {
        redirect(`/change-password?error=${encodeURIComponent(updateError.message)}`)
    }

    // Update force_password_change flag
    const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({ force_password_change: false })
        .eq('id', user.id)

    if (profileError) {
        // We still redirect to dashboard as password was changed, but log the error
    }

    redirect('/dashboard?message=Password updated successfully')
}
