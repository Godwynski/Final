'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        redirect('/login?error=Could not authenticate user')
    }

    if (user) {
        // Sync role to user_metadata
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role && user.user_metadata?.role !== profile.role) {
            await supabase.auth.updateUser({
                data: { role: profile.role }
            })
        }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    // Signup is disabled for public users. Only admins can create accounts.
    redirect('/login?error=Account creation is disabled. Please contact an administrator.')
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}
