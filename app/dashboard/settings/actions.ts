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

export async function getSettings() {
    const supabase = await createClient()
    const { data, error } = await supabase.from('barangay_settings').select('*').single()

    if (error) {
        // If table doesn't exist or is empty, return null or default
        // console.error('Error fetching settings:', error)
        return null
    }
    return data
}

export async function updateSettings(formData: FormData) {
    const supabase = await createClient()

    const province = formData.get('province') as string
    const city_municipality = formData.get('city_municipality') as string
    const barangay_name = formData.get('barangay_name') as string
    const punong_barangay = formData.get('punong_barangay') as string
    const barangay_secretary = formData.get('barangay_secretary') as string

    // Fetch ID first or insert if not exists
    const { data: currentSettings } = await supabase.from('barangay_settings').select('id').single()

    if (currentSettings) {
        const { error: updateError } = await supabase.from('barangay_settings').update({
            province,
            city_municipality,
            barangay_name,
            punong_barangay,
            barangay_secretary,
            updated_at: new Date().toISOString()
        }).eq('id', currentSettings.id)

        if (updateError) {
            return { error: 'Failed to update settings: ' + updateError.message }
        }
    } else {
        // Insert if not exists
        const { error: insertError } = await supabase.from('barangay_settings').insert({
            province,
            city_municipality,
            barangay_name,
            punong_barangay,
            barangay_secretary
        })

        if (insertError) {
            return { error: 'Failed to create settings: ' + insertError.message }
        }
    }

    revalidatePath('/dashboard/settings')
    revalidatePath('/dashboard/cases')
    return { success: true, message: 'System settings updated successfully.' }
}
