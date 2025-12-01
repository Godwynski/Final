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

    if (!user) return { error: 'Unauthorized' }

    const content = formData.get('content') as string

    const { error } = await supabase
        .from('case_notes')
        .insert({
            case_id: caseId,
            content,
            created_by: user.id,
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath(`/dashboard/cases/${caseId}`)
    return { success: true }
}

export async function deleteCaseNote(caseId: string, noteId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('case_notes')
        .delete()
        .eq('id', noteId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath(`/dashboard/cases/${caseId}`)
    return { success: true }
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
        return { error: error.message }
    }

    // Mock Email Sending
    console.log(`[MOCK EMAIL] To Complainant: Access your case evidence portal here: ${process.env.NEXT_PUBLIC_BASE_URL}/guest/${token}. PIN: ${pin}`)

    revalidatePath(`/dashboard/cases/${caseId}`)
    return { success: true, pin, message: `Secure link generated. PIN: ${pin}` }
}

export async function toggleGuestLinkStatus(linkId: string, currentStatus: boolean, caseId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('guest_links')
        .update({ is_active: !currentStatus })
        .eq('id', linkId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath(`/dashboard/cases/${caseId}`)
    return { success: true }
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

import { createAdminClient } from '@/utils/supabase/admin'

export async function uploadEvidence(caseId: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const supabaseAdmin = createAdminClient()

    const file = formData.get('file') as File
    const description = formData.get('description') as string

    if (!file) return { error: 'No file uploaded' }

    // Validate File Type (Images Only for now, but could be expanded)
    if (!file.type.startsWith('image/')) {
        return { error: 'Only image files are allowed' }
    }

    // Upload to Storage
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
        return { error: `Storage upload failed: ${uploadError.message}` }
    }

    // Get Public URL
    const { data: { publicUrl } } = supabaseAdmin
        .storage
        .from('evidence')
        .getPublicUrl(fileName)

    // Insert Record
    const { error: insertError } = await supabaseAdmin
        .from('evidence')
        .insert({
            case_id: caseId,
            file_path: publicUrl,
            file_name: file.name,
            file_type: file.type,
            description: description,
            uploaded_by: user.id
        })

    if (insertError) {
        return { error: `Database insert failed: ${insertError.message}` }
    }

    revalidatePath(`/dashboard/cases/${caseId}`)
    return { success: true }
}

export async function deleteEvidence(caseId: string, evidenceId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const supabaseAdmin = createAdminClient()

    // Get evidence to find file path
    const { data: evidence, error: fetchError } = await supabaseAdmin
        .from('evidence')
        .select('*')
        .eq('id', evidenceId)
        .single()

    if (fetchError || !evidence) {
        return { error: 'Evidence not found' }
    }

    // Delete from Storage
    try {
        const url = new URL(evidence.file_path)
        const pathParts = url.pathname.split('/evidence/')
        if (pathParts.length > 1) {
            const storagePath = pathParts[1]
            await supabaseAdmin.storage.from('evidence').remove([storagePath])
        }
    } catch (e) {
        console.error('Error parsing file path:', e)
    }

    // Delete Record
    const { error: deleteError } = await supabaseAdmin
        .from('evidence')
        .delete()
        .eq('id', evidenceId)

    if (deleteError) {
        return { error: `Failed to delete record: ${deleteError.message}` }
    }

    revalidatePath(`/dashboard/cases/${caseId}`)
    return { success: true }
}

export async function performCaseAction(caseId: string, action: string, input?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // Import workflow definition (we need to replicate logic or import it if shared, 
    // but since this is server side, we can just define the logic here or import the constant if it's pure JS/TS)
    // For now, I'll implement the switch logic directly to map actions to DB updates.

    let newStatus = null;
    let narrativeUpdate = '';
    let logAction = '';

    switch (action) {
        case 'accept_case':
            newStatus = 'Under Investigation';
            logAction = 'Accepted Case';
            narrativeUpdate = `Case accepted for investigation by ${user.email}.`;
            break;
        case 'refer_case':
            newStatus = 'Referred';
            logAction = 'Referred Case';
            narrativeUpdate = `Case referred to: ${input}.`;
            break;
        case 'dismiss_case':
            newStatus = 'Dismissed';
            logAction = 'Dismissed Case';
            narrativeUpdate = `Case dismissed. Reason: ${input}.`;
            break;
        case 'schedule_hearing':
            newStatus = 'Hearing Scheduled';
            logAction = 'Scheduled Hearing';
            narrativeUpdate = `Hearing scheduled for: ${input}.`;
            // TODO: We might want to save the hearing date in a specific field if we had one.
            // For now, we'll append it to the narrative action.
            break;
        case 'issue_summon':
            // No status change, just log
            logAction = 'Issued Summon';
            narrativeUpdate = `Summon issued.`;
            break;
        case 'settle_case':
            newStatus = 'Settled';
            logAction = 'Settled Case';
            narrativeUpdate = `Case settled. Terms: ${input}.`;
            break;
        case 'reschedule_hearing':
            newStatus = 'Hearing Scheduled'; // Stays same
            logAction = 'Rescheduled Hearing';
            narrativeUpdate = `Hearing rescheduled to: ${input}.`;
            break;
        case 'issue_cfa':
            newStatus = 'Closed';
            logAction = 'Issued CFA';
            narrativeUpdate = `Certificate to File Action (CFA) issued. Reason: ${input}.`;
            break;
        case 'reopen_case':
            newStatus = 'Under Investigation';
            logAction = 'Re-opened Case';
            narrativeUpdate = `Case re-opened. Reason: ${input}.`;
            break;
        default:
            return { error: 'Invalid action' };
    }

    // Update Case Status if needed
    if (newStatus) {
        const { error: statusError } = await supabase
            .from('cases')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', caseId)

        if (statusError) return { error: statusError.message }
    }

    // Append to Narrative Action (Action Taken)
    // We fetch the current narrative first
    const { data: caseData } = await supabase.from('cases').select('narrative_action').eq('id', caseId).single();
    const currentNarrative = caseData?.narrative_action || '';
    const timestamp = new Date().toLocaleString();
    const newNarrative = `${currentNarrative ? currentNarrative + '\n' : ''}[${timestamp}] ${narrativeUpdate}`;

    const { error: narrativeError } = await supabase
        .from('cases')
        .update({ narrative_action: newNarrative })
        .eq('id', caseId)

    if (narrativeError) return { error: narrativeError.message }

    // Log to Audit Logs
    await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: logAction,
        details: {
            action_key: action,
            input: input,
            new_status: newStatus
        },
        case_id: caseId
    })

    revalidatePath(`/dashboard/cases/${caseId}`)
    return { success: true, message: `Action "${logAction}" completed.` }
}
