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
    const password = formData.get('password') as string
    const role = formData.get('role') as string

    const supabaseAdmin = createAdminClient()

    const { data: newUser, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { role } // Store role in metadata initially if needed, but we use profiles table
    })

    if (error) {
        console.error('Error creating user:', error)
        redirect(`/dashboard/admin?error=${encodeURIComponent(error.message)}`)
    }

    if (newUser.user) {
        // Update profiles table (trigger might handle this, but we want to ensure role is set)
        // The trigger sets default to 'staff', we update it here if needed or rely on metadata if we updated the trigger.
        // Let's explicitly update the profile to be safe.
        await supabaseAdmin.from('profiles').update({ role }).eq('id', newUser.user.id)

        // Log action
        await supabase.from('audit_logs').insert({
            user_id: currentUser?.id,
            action: 'Created User',
            details: { target_user: email, role },
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
