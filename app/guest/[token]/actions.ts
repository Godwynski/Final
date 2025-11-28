'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function uploadGuestEvidence(token: string, formData: FormData) {
    const supabaseAdmin = createAdminClient()

    // 1. Verify Token
    const { data: links, error: linkError } = await supabaseAdmin
        .from('guest_links')
        .select('*')
        .eq('token', token)
        .single()

    if (linkError || !links) {
        return { error: 'Invalid or expired token.' }
    }

    if (new Date(links.expires_at) < new Date() || !links.is_active) {
        return { error: 'Link has expired.' }
    }

    const caseId = links.case_id
    if (!caseId) {
        return { error: 'Link is not associated with a case.' }
    }

    // 2. Verify PIN from Cookie
    const cookieStore = await cookies()
    const pinCookie = cookieStore.get(`guest_pin_${token}`)

    if (!pinCookie || pinCookie.value !== links.pin) {
        return { error: 'Invalid or missing PIN. Please re-enter your PIN.' }
    }

    // 2. Handle File Upload (Mock for now, or real if bucket exists)
    // Since we can't easily upload binary files via server actions without client-side help or base64,
    // we will assume the file is passed as a string path or we simulate it.
    // BUT, in a real app, we would upload to storage first.
    // For this demo, let's just insert a record into 'evidence' table as if it was uploaded.

    const file = formData.get('file') as File
    const description = formData.get('description') as string

    if (!file) {
        return { error: 'No file uploaded.' }
    }

    // Validate File Type (Images Only)
    if (!file.type.startsWith('image/')) {
        return { error: 'Only image files are allowed.' }
    }

    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${caseId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`

    const { error: uploadError } = await supabaseAdmin
        .storage
        .from('evidence')
        .upload(fileName, file, {
            contentType: file.type,
            upsert: false
        })

    if (uploadError) {
        console.error('Storage upload error:', uploadError)
        return { error: 'Failed to upload file to storage.' }
    }

    // Get Public URL
    const { data: { publicUrl } } = supabaseAdmin
        .storage
        .from('evidence')
        .getPublicUrl(fileName)

    // Insert into Evidence Table using Admin Client (Bypass RLS)
    const { error: insertError } = await supabaseAdmin
        .from('evidence')
        .insert({
            case_id: caseId,
            file_path: publicUrl, // Storing the full URL for easier access
            file_name: file.name,
            file_type: file.type,
            description: description,
            // uploaded_by is null for guests
        })

    if (insertError) {
        console.error('Evidence record error:', insertError)
        return { error: 'Failed to save evidence record.' }
    }

    // Log action (System)
    await supabaseAdmin.from('audit_logs').insert({
        action: 'Guest Upload',
        details: { case_id: caseId, token_id: links.id, file_name: file.name },
    })

    // Notify the creator of the link
    await supabaseAdmin.from('notifications').insert({
        user_id: links.created_by,
        title: 'New Evidence Uploaded',
        message: `A guest uploaded evidence: ${file.name}`,
        link: `/dashboard/cases/${caseId}`,
    })

    revalidatePath(`/guest/${token}`)
    return { success: true }
}



export async function verifyGuestPin(token: string, pin: string) {
    const supabaseAdmin = createAdminClient()

    const { data: link, error } = await supabaseAdmin
        .from('guest_links')
        .select('pin')
        .eq('token', token)
        .single()

    if (error || !link) {
        return { error: 'Invalid token' }
    }

    if (link.pin !== pin) {
        return { error: 'Invalid PIN' }
    }

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set(`guest_pin_${token}`, pin, { httpOnly: true, secure: true, maxAge: 60 * 60 * 24 }) // 24 hours

    revalidatePath(`/guest/${token}`)
    return { success: true }
}
