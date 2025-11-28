'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createUser(formData: FormData) {
    const supabase = await createClient()
    const { data: { user: currentUser } } = await supabase.auth.getUser()

    // Check if current user is admin
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', currentUser?.id).single()
    if (profile?.role !== 'admin') {
        throw new Error('Unauthorized')
    }

    const email = formData.get('email') as string
    const fullName = formData.get('full_name') as string
    const role = formData.get('role') as string
    const defaultPassword = 'Blotter123!' // Default password

    const supabaseAdmin = createAdminClient()

    const { data: newUser, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: defaultPassword,
        email_confirm: true,
        user_metadata: { role, full_name: fullName } // Store role and full_name in metadata
    })

    if (error) {
        console.error('Error creating user:', error)
        redirect(`/dashboard/admin?error=${encodeURIComponent(error.message)}`)
    }

    if (newUser.user) {
        // Update profiles table (trigger might handle this, but we want to ensure role and flags are set)
        await supabaseAdmin.from('profiles').update({
            role,
            full_name: fullName,
            force_password_change: true
        }).eq('id', newUser.user.id)

        // Log action
        await supabase.from('audit_logs').insert({
            user_id: currentUser?.id,
            action: 'Created User',
            details: { target_user: email, target_name: fullName, role },
        })
    }

    revalidatePath('/dashboard/admin')
}

export async function deleteUser(formData: FormData) {
    const supabase = await createClient()
    const { data: { user: currentUser } } = await supabase.auth.getUser()

    if (!currentUser) redirect('/login')

    const userId = formData.get('userId') as string

    if (userId === currentUser.id) {
        redirect('/dashboard/admin?error=You cannot delete your own account.')
    }

    // Check permissions
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', currentUser.id).single()
    if (profile?.role !== 'admin') {
        throw new Error('Unauthorized')
    }

    const supabaseAdmin = createAdminClient()

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (error) redirect(`/dashboard/admin?error=${encodeURIComponent(error.message)}`)

    await supabase.from('audit_logs').insert({
        user_id: currentUser.id,
        action: 'Deleted User',
        details: { target_user_id: userId },
    })

    revalidatePath('/dashboard/admin')
}

export async function updateUserRole(formData: FormData) {
    const supabase = await createClient()
    const { data: { user: currentUser } } = await supabase.auth.getUser()

    if (!currentUser) redirect('/login')

    const userId = formData.get('userId') as string
    const role = formData.get('role') as string

    if (userId === currentUser.id) {
        redirect('/dashboard/admin?error=You cannot change your own role.')
    }

    // Check permissions
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', currentUser.id).single()
    if (profile?.role !== 'admin') {
        throw new Error('Unauthorized')
    }

    const supabaseAdmin = createAdminClient()

    const { error } = await supabaseAdmin.from('profiles').update({ role }).eq('id', userId)

    if (error) redirect(`/dashboard/admin?error=${encodeURIComponent(error.message)}`)

    await supabase.from('audit_logs').insert({
        user_id: currentUser.id,
        action: 'Updated User Role',
        details: { target_user_id: userId, new_role: role },
    })

    revalidatePath('/dashboard/admin')
}

export async function updateUser(formData: FormData) {
    const supabase = await createClient()
    const { data: { user: currentUser } } = await supabase.auth.getUser()

    if (!currentUser) redirect('/login')

    const userId = formData.get('userId') as string
    const fullName = formData.get('full_name') as string
    const role = formData.get('role') as string

    // Check permissions (only admin)
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', currentUser.id).single()
    if (profile?.role !== 'admin') {
        throw new Error('Unauthorized')
    }

    const supabaseAdmin = createAdminClient()

    // Update Profile
    const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({ full_name: fullName, role })
        .eq('id', userId)

    if (profileError) {
        redirect(`/dashboard/admin?error=${encodeURIComponent(profileError.message)}`)
    }

    // Update Metadata (optional but good for consistency)
    await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: { full_name: fullName, role }
    })

    await supabase.from('audit_logs').insert({
        user_id: currentUser.id,
        action: 'Updated User Details',
        details: { target_user_id: userId, full_name: fullName, role },
    })

    revalidatePath('/dashboard/admin')
}

export async function adminResetPassword(formData: FormData) {
    const supabase = await createClient()
    const { data: { user: currentUser } } = await supabase.auth.getUser()

    if (!currentUser) redirect('/login')

    const userId = formData.get('userId') as string
    const defaultPassword = 'Blotter123!'

    // Check permissions
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', currentUser.id).single()
    if (profile?.role !== 'admin') {
        throw new Error('Unauthorized')
    }

    const supabaseAdmin = createAdminClient()

    // Update Password
    const { error: passwordError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: defaultPassword
    })

    if (passwordError) {
        redirect(`/dashboard/admin?error=${encodeURIComponent(passwordError.message)}`)
    }

    // Set force_password_change
    await supabaseAdmin
        .from('profiles')
        .update({ force_password_change: true })
        .eq('id', userId)

    await supabase.from('audit_logs').insert({
        user_id: currentUser.id,
        action: 'Admin Reset Password',
        details: { target_user_id: userId },
    })

    revalidatePath('/dashboard/admin')
    redirect('/dashboard/admin?message=Password reset to default (Blotter123!)')
}
