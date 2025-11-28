'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateCaseStatus(caseId: string, formData: FormData) {
    const supabase = await createClient()
    const status = formData.get('status') as string

    const { error } = await supabase
        .from('cases')
        .update({ status })
        .eq('id', caseId)

    if (error) {
        redirect(`/dashboard/cases/${caseId}?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath(`/dashboard/cases/${caseId}`)
    redirect(`/dashboard/cases/${caseId}?message=Status updated to ${status}`)
}

export async function addInvolvedParty(caseId: string, formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const type = formData.get('type') as string
    const contact_number = formData.get('contact_number') as string
    const email = formData.get('email') as string
    const address = formData.get('address') as string

    const { error } = await supabase
        .from('involved_parties')
        .insert({
            case_id: caseId,
            name,
            type,
            contact_number,
            email,
            address,
        })

    if (error) {
        redirect(`/dashboard/cases/${caseId}?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath(`/dashboard/cases/${caseId}`)
    redirect(`/dashboard/cases/${caseId}?message=Added ${name} as ${type}`)
}

export async function addCaseNote(caseId: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const content = formData.get('content') as string

    const { error } = await supabase
        .from('case_notes')
        .insert({
            case_id: caseId,
            content,
            created_by: user.id,
        })

    if (error) {
        redirect(`/dashboard/cases/${caseId}?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath(`/dashboard/cases/${caseId}`)
    redirect(`/dashboard/cases/${caseId}?message=Note added successfully`)
}

export async function generateCaseGuestLink(caseId: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const durationHours = parseInt(formData.get('duration') as string)
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + durationHours)
    const token = crypto.randomUUID()

    // Generate 6-digit PIN
    const pin = Math.floor(100000 + Math.random() * 900000).toString()

    const { error } = await supabase
        .from('guest_links')
        .insert({
            token,
            pin,
            case_id: caseId,
            created_by: user.id,
            expires_at: expiresAt.toISOString(),
            is_active: true,
        })

    if (error) {
        redirect(`/dashboard/cases/${caseId}?error=${encodeURIComponent(error.message)}`)
    }

    // Mock Email Sending
    console.log(`[MOCK EMAIL] To Complainant: Access your case evidence portal here: ${process.env.NEXT_PUBLIC_BASE_URL}/guest/${token}. PIN: ${pin}`)

    revalidatePath(`/dashboard/cases/${caseId}`)
    redirect(`/dashboard/cases/${caseId}?message=Secure link generated. PIN: ${pin}`)
}

export async function toggleGuestLinkStatus(linkId: string, currentStatus: boolean, caseId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('guest_links')
        .update({ is_active: !currentStatus })
        .eq('id', linkId)

    if (error) {
        redirect(`/dashboard/cases/${caseId}?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath(`/dashboard/cases/${caseId}`)
}
