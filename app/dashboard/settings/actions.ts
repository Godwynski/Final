'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const fullName = formData.get('full_name') as string

    const supabaseAdmin = createAdminClient()

    // Update Profile
    const { error } = await supabaseAdmin
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id)

    if (error) {
        redirect(`/dashboard/settings?error=${encodeURIComponent(error.message)}`)
    }

    // Update Metadata
    await supabaseAdmin.auth.admin.updateUserById(user.id, {
        user_metadata: { full_name: fullName }
    })

    await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'Updated Own Profile',
        details: { full_name: fullName },
    })

    revalidatePath('/dashboard/settings')
    redirect('/dashboard/settings?message=Profile updated successfully')
}

export async function changePassword(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const currentPassword = formData.get('current_password') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirm_password') as string

    if (password !== confirmPassword) {
        redirect('/dashboard/settings?error=Passwords do not match')
    }

    if (password.length < 6) {
        redirect('/dashboard/settings?error=Password must be at least 6 characters')
    }

    // Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: currentPassword,
    })

    if (signInError) {
        redirect('/dashboard/settings?error=Incorrect current password')
    }

    const supabaseAdmin = createAdminClient()

    const { error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
        password: password
    })

    if (error) {
        redirect(`/dashboard/settings?error=${encodeURIComponent(error.message)}`)
    }

    await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'Changed Password',
        details: {},
    })

    redirect('/dashboard/settings?message=Password changed successfully')
}
