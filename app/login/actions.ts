'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { RateLimiterMemory } from 'rate-limiter-flexible'
import { CONFIG } from '@/constants/config'

// Rate limiter for login attempts
const loginLimiter = new RateLimiterMemory({
    points: CONFIG.RATE_LIMIT.LOGIN.POINTS,
    duration: CONFIG.RATE_LIMIT.LOGIN.DURATION,
})

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Validate inputs
    if (!email || !password) {
        redirect('/login?error=Email and password are required')
    }

    // Rate limiting
    try {
        await loginLimiter.consume(email.toLowerCase())
    } catch {
        redirect('/login?error=Too many login attempts. Please try again in 15 minutes.')
    }

    const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        redirect('/login?error=Invalid email or password')
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
