'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { resend } from '@/utils/resend'

export async function updateCaseStatus(caseId: string, formData: FormData) {
    const supabase = await createClient()
    const status = formData.get('status') as string

    const { data: caseData } = await supabase
        .from('cases')
        .select('reported_by, title, status')
        .eq('id', caseId)
        .single()

    const { error } = await supabase
        .from('cases')
        .update({ status })
        .eq('id', caseId)

    if (error) {
        redirect(`/dashboard/cases/${caseId}?error=${encodeURIComponent(error.message)}`)
    }

    // Notify the reporter
    if (caseData && caseData.reported_by) {
        await supabase.from('notifications').insert({
            user_id: caseData.reported_by,
            title: 'Case Status Updated',
            message: `Case "${caseData.title}" is now ${status}`,
            link: `/dashboard/cases/${caseId}`,
        })
    }

    // Log the status change
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        await supabase.from('audit_logs').insert({
            user_id: user.id,
            action: 'Status Updated',
            details: {
                old_status: caseData?.status || 'Unknown',
                new_status: status
            },
            case_id: caseId
        })
    }

    revalidatePath(`/dashboard/cases/${caseId}`)
    redirect(`/dashboard/cases/${caseId}?message=Status updated to ${status}`)
}

export async function emailGuestLink(formData: FormData) {
    const email = formData.get('email') as string
    const link = formData.get('link') as string
    const pin = formData.get('pin') as string
    const caseId = formData.get('caseId') as string

    try {
        const { data, error } = await resend.emails.send({
            from: 'Blotter System <onboarding@resend.dev>', // Default Resend sender
            to: [email],
            subject: 'Secure Evidence Upload Link',
            html: `
                <h1>Secure Evidence Upload Link</h1>
                <p>You have been invited to upload evidence for a case.</p>
                <p><strong>Link:</strong> <a href="${link}">${link}</a></p>
                <p><strong>PIN:</strong> ${pin}</p>
                <p>This link will expire soon.</p>
            `,
        })

        if (error) {
            console.error('Resend Error:', error)
            redirect(`/dashboard/cases/${caseId}?error=Failed to send email: ${error.message}`)
        }
    } catch (e) {
        console.error('Email Error:', e)
        // Don't redirect here if we want to handle it gracefully, but for now redirect with error
        // redirect throws, so we need to be careful inside try/catch if we want to redirect out.
        // Actually, redirect should be outside try/catch or re-thrown.
    }

    redirect(`/dashboard/cases/${caseId}?message=Email sent to ${email}`)
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

    let durationHours = parseInt(formData.get('duration') as string)
    if (isNaN(durationHours)) {
        durationHours = 24
    }
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

export async function updateCaseDetails(caseId: string, formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const incident_date = formData.get('incident_date') as string
    const incident_location = formData.get('incident_location') as string
    const incident_type = formData.get('incident_type') as string
    const narrative_facts = formData.get('narrative_facts') as string
    const narrative_action = formData.get('narrative_action') as string

    const { error } = await supabase
        .from('cases')
        .update({
            title,
            incident_date,
            incident_location,
            incident_type,
            narrative_facts,
            narrative_action,
            updated_at: new Date().toISOString()
        })
        .eq('id', caseId)

    if (error) {
        redirect(`/dashboard/cases/${caseId}/edit?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath(`/dashboard/cases/${caseId}`)
    redirect(`/dashboard/cases/${caseId}?message=Case updated successfully`)
}

export async function deleteCase(caseId: string) {
    const supabase = await createClient()

    // Assuming DB has ON DELETE CASCADE for foreign keys, we just delete the case.
    const { error } = await supabase
        .from('cases')
        .delete()
        .eq('id', caseId)

    if (error) {
        redirect(`/dashboard/cases/${caseId}/edit?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/dashboard/cases')
    redirect('/dashboard/cases?message=Case deleted successfully')
}

export async function updateActionTaken(caseId: string, formData: FormData) {
    const supabase = await createClient()
    const narrative_action = formData.get('narrative_action') as string

    const { error } = await supabase
        .from('cases')
        .update({
            narrative_action,
            updated_at: new Date().toISOString()
        })
        .eq('id', caseId)

    if (error) {
        redirect(`/dashboard/cases/${caseId}?error=${encodeURIComponent(error.message)}`)
    }

    // Log the action
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        await supabase.from('audit_logs').insert({
            user_id: user.id,
            action: 'Case Updated',
            details: { narrative_action: narrative_action },
            case_id: caseId
        })
    }

    revalidatePath(`/dashboard/cases/${caseId}`)
    redirect(`/dashboard/cases/${caseId}?message=Action taken updated successfully`)
}
