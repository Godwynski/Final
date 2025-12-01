/**
 * Authentication and authorization utility functions
 * Reduces code duplication across server actions
 */

import { createClient } from '@/utils/supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

/**
 * Ensures the user is authenticated
 * @throws Redirects to login if not authenticated
 */
export async function requireAuth() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return { supabase, user }
}

/**
 * Ensures the user is authenticated and has admin role
 * @throws Error if not admin
 */
export async function requireAdmin(supabase: SupabaseClient, userId: string) {
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

    if (error) {
        throw new Error('Failed to fetch user profile')
    }

    if (profile?.role !== 'admin') {
        throw new Error('Unauthorized: Admin access required')
    }

    return profile
}

/**
 * Checks if user is admin or the creator of a resource
 */
export async function canModifyResource(
    supabase: SupabaseClient,
    userId: string,
    creatorId: string
): Promise<boolean> {
    if (userId === creatorId) {
        return true
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

    return profile?.role === 'admin'
}

/**
 * Generates a cryptographically secure random password
 */
export function generateSecurePassword(): string {
    const crypto = require('crypto')

    // Generate a base password with random bytes
    const randomBytes = crypto.randomBytes(16).toString('base64')

    // Clean it and ensure it meets complexity requirements
    const base = randomBytes.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12)

    // Add required character types
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const special = '!@#$%^&*'

    const randomChar = (chars: string) =>
        chars[crypto.randomInt(0, chars.length)]

    // Ensure at least one of each required type
    const password =
        base +
        randomChar(uppercase) +
        randomChar(lowercase) +
        randomChar(numbers) +
        randomChar(special)

    // Shuffle the password
    return password
        .split('')
        .sort(() => crypto.randomInt(-1, 2))
        .join('')
}

/**
 * Generates a cryptographically secure PIN
 */
export function generateSecurePIN(): string {
    const crypto = require('crypto')
    return crypto.randomInt(100000, 999999).toString()
}
