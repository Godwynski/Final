'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { mailersend } from '@/utils/mailersend'
import { EmailParams, Sender, Recipient } from "mailersend";
import { addInvolvedPartySchema, addCaseNoteSchema, updateCaseDetailsSchema, updateActionTakenSchema, guestLinkDurationSchema } from '@/utils/validation'
import { generateSecurePIN, canModifyResource } from '@/utils/auth'
import { CONFIG } from '@/constants/config'
import { createAdminClient } from '@/utils/supabase/admin'

const TERMINAL_STATUSES = ['Closed', 'Settled', 'Dismissed', 'Referred']

async function isCaseTerminal(supabase: any, caseId: string) {
    const { data } = await supabase
        .from('cases')
        .select('status')
        .eq('id', caseId)
        .single()

    return data && TERMINAL_STATUSES.includes(data.status)
}

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

    const fromEmail = process.env.MAILERSEND_FROM_EMAIL || 'info@trial-z3m5jgr209zgdpyo.mlsender.net';
    const fromName = process.env.MAILERSEND_FROM_NAME || 'Blotter System';

    const sentFrom = new Sender(fromEmail, fromName);
    const recipients = [
        new Recipient(email, "Guest")
    ];

    const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setSubject('Secure Evidence Upload Link')
        .setHtml(`
            <h1>Secure Evidence Upload Link</h1>
            <p>You have been invited to upload evidence for a case.</p>
            <p><strong>Link:</strong> <a href="${link}">${link}</a></p>
            <p><strong>PIN:</strong> ${pin}</p>
            <p>This link will expire soon.</p>
        `)
        .setText(`Secure Evidence Upload Link\n\nYou have been invited to upload evidence for a case.\n\nLink: ${link}\nPIN: ${pin}\n\nThis link will expire soon.`);

    try {
        await mailersend.email.send(emailParams);
    } catch (error: any) {
        redirect(`/dashboard/cases/${caseId}?error=${encodeURIComponent('Failed to send email: ' + (error.message || error))}`)
    }

    redirect(`/dashboard/cases/${caseId}?tab=evidence&message=Email sent to ${email}`)
}

export async function addInvolvedParty(caseId: string, formData: FormData) {
    const supabase = await createClient()

    if (await isCaseTerminal(supabase, caseId)) {
        redirect(`/dashboard/cases/${caseId}?tab=parties&error=Cannot modify a closed or settled case`)
    }


    const name = formData.get('name') as string
    const type = formData.get('type') as string
    const contact_number = formData.get('contact_number') as string
    const email = formData.get('email') as string
    const address = formData.get('address') as string

    // Validate input
    const validation = addInvolvedPartySchema.safeParse({
        name, type, contact_number, email, address
    })

    if (!validation.success) {
        redirect(`/dashboard/cases/${caseId}?tab=parties&error=${encodeURIComponent(validation.error.issues[0].message)}`)
    }

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
        redirect(`/dashboard/cases/${caseId}?tab=parties&error=${encodeURIComponent(error.message)}`)
    }

    // Audit Log
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        await supabase.from('audit_logs').insert({
            user_id: user.id,
            action: 'Added Party',
            details: { name, type, case_id: caseId },
            case_id: caseId
        })
    }

    revalidatePath(`/dashboard/cases/${caseId}`)
    redirect(`/dashboard/cases/${caseId}?tab=parties&message=Added ${name} as ${type}`)
}

export async function addCaseNote(caseId: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (await isCaseTerminal(supabase, caseId)) {
        return { error: 'Cannot modify a closed or settled case' }
    }

    if (!user) return { error: 'Unauthorized' }

    const content = formData.get('content') as string

    // Validate input
    const validation = addCaseNoteSchema.safeParse({ content })
    if (!validation.success) {
        return { error: validation.error.issues[0].message }
    }

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

    if (await isCaseTerminal(supabase, caseId)) {
        return { error: 'Cannot modify a closed or settled case' }
    }

    if (!user) return { error: 'Unauthorized' }

    // Check authorization: must be creator or admin
    const { data: note } = await supabase
        .from('case_notes')
        .select('created_by')
        .eq('id', noteId)
        .single()

    if (!note) {
        return { error: 'Note not found' }
    }

    const canModify = await canModifyResource(supabase, user.id, note.created_by)
    if (!canModify) {
        return { error: 'Unauthorized: You can only delete your own notes' }
    }

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

    if (await isCaseTerminal(supabase, caseId)) {
        return { error: 'Cannot modify a closed or settled case' }
    }

    if (!user) throw new Error('Unauthorized')

    const durationStr = formData.get('duration') as string
    const durationHours = durationStr ? parseInt(durationStr) : 72 // Default 3 days

    // Validate duration
    const validation = guestLinkDurationSchema.safeParse(durationHours)
    if (!validation.success) {
        return { error: validation.error.issues[0].message }
    }

    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + durationHours)
    const token = crypto.randomUUID()

    // Generate secure 6-digit PIN
    const pin = generateSecurePIN()

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

    revalidatePath(`/dashboard/cases/${caseId}`)
    return { success: true, pin, message: `Secure link generated. PIN: ${pin}` }
}

export async function toggleGuestLinkStatus(linkId: string, currentStatus: boolean, caseId: string) {
    const supabase = await createClient()

    if (await isCaseTerminal(supabase, caseId)) {
        return { error: 'Cannot modify a closed or settled case' }
    }

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

    if (await isCaseTerminal(supabase, caseId)) {
        redirect(`/dashboard/cases/${caseId}?error=Cannot modify a closed or settled case`)
    }

    const title = formData.get('title') as string
    const incident_date = formData.get('incident_date') as string
    const incident_location = formData.get('incident_location') as string
    const incident_type = formData.get('incident_type') as string
    const narrative_facts = formData.get('narrative_facts') as string
    const narrative_action = formData.get('narrative_action') as string

    // Validate input
    const validation = updateCaseDetailsSchema.safeParse({
        title, incident_date, incident_location, incident_type, narrative_facts, narrative_action
    })

    if (!validation.success) {
        redirect(`/dashboard/cases/${caseId}/edit?error=${encodeURIComponent(validation.error.issues[0].message)}`)
    }

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

    // Audit Log
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        await supabase.from('audit_logs').insert({
            user_id: user.id,
            action: 'Updated Case Details',
            details: { title, incident_type },
            case_id: caseId
        })
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

    // Audit Log (before redirect, user is still logged in)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        await supabase.from('audit_logs').insert({
            user_id: user.id,
            action: 'Deleted Case',
            details: { case_id: caseId },
            // case_id is set null on delete, but we log it here. 
            // Actually, if case is deleted, foreign key might fail if not set null.
            // Schema says: case_id uuid references cases(id) on delete set null
            case_id: caseId
        })
    }

    revalidatePath('/dashboard/cases')
    redirect('/dashboard/cases?message=Case deleted successfully')
}

export async function updateActionTaken(caseId: string, formData: FormData) {
    const supabase = await createClient()

    if (await isCaseTerminal(supabase, caseId)) {
        redirect(`/dashboard/cases/${caseId}?error=Cannot modify a closed or settled case`)
    }
    const narrative_action = formData.get('narrative_action') as string

    // Validate input
    const validation = updateActionTakenSchema.safeParse({ narrative_action })
    if (!validation.success) {
        redirect(`/dashboard/cases/${caseId}?error=${encodeURIComponent(validation.error.issues[0].message)}`)
    }

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

export async function uploadEvidence(caseId: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    if (await isCaseTerminal(supabase, caseId)) {
        return { error: 'Cannot modify a closed or settled case' }
    }

    const supabaseAdmin = createAdminClient()

    const file = formData.get('file') as File
    const description = formData.get('description') as string

    if (!file) return { error: 'No file uploaded' }

    // Check photo count limit for staff/admin
    const { count: photoCount } = await supabaseAdmin
        .from('evidence')
        .select('id', { count: 'exact', head: true })
        .eq('case_id', caseId)
        .in('file_type', CONFIG.FILE_UPLOAD.ALLOWED_IMAGE_TYPES)

    if (photoCount && photoCount >= CONFIG.FILE_UPLOAD.STAFF_MAX_PHOTOS_PER_CASE) {
        return { error: `Upload limit reached. Maximum ${CONFIG.FILE_UPLOAD.STAFF_MAX_PHOTOS_PER_CASE} photos allowed per case.` }
    }

    // Validate file size
    if (file.size > CONFIG.FILE_UPLOAD.MAX_SIZE) {
        return { error: `File size must be less than ${CONFIG.FILE_UPLOAD.MAX_SIZE_MB}MB` }
    }

    // Validate file type
    if (!CONFIG.FILE_UPLOAD.ALLOWED_TYPES.includes(file.type as any)) {
        return { error: `Only ${CONFIG.FILE_UPLOAD.ALLOWED_TYPES.join(', ')} files are allowed` }
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

    // Audit Log
    await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'Uploaded Evidence',
        details: {
            file_name: file.name,
            file_path: publicUrl,
            description
        },
        case_id: caseId
    })


    revalidatePath(`/dashboard/cases/${caseId}`)
    return { success: true }
}

export async function deleteEvidence(caseId: string, evidenceId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    if (await isCaseTerminal(supabase, caseId)) {
        return { error: 'Cannot modify a closed or settled case' }
    }

    const supabaseAdmin = createAdminClient()

    // Get evidence to find file path and check authorization
    const { data: evidence, error: fetchError } = await supabaseAdmin
        .from('evidence')
        .select('*')
        .eq('id', evidenceId)
        .single()

    if (fetchError || !evidence) {
        return { error: 'Evidence not found' }
    }

    // Check authorization: must be uploader or admin
    const canDelete = await canModifyResource(supabase, user.id, evidence.uploaded_by || '')
    if (!canDelete) {
        return { error: 'Unauthorized: You can only delete evidence you uploaded' }
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
        // Continue to delete record even if storage delete fails
    }

    // Delete Record
    const { error: deleteError } = await supabaseAdmin
        .from('evidence')
        .delete()
        .eq('id', evidenceId)

    if (deleteError) {
        return { error: `Failed to delete record: ${deleteError.message}` }
    }

    // Audit Log
    await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'Deleted Evidence',
        details: {
            evidence_id: evidenceId,
            file_name: evidence.file_name
        },
        case_id: caseId
    })


    revalidatePath(`/dashboard/cases/${caseId}`)
    return { success: true }
}

export async function performCaseAction(caseId: string, action: string, input?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase.from('profiles').select('full_name, email').eq('id', user?.id).single()

    if (!user) return { error: 'Unauthorized' }

    let newStatus = null;
    let narrativeUpdate = '';
    let logAction = '';
    let resolutionDetails: any = null;

    switch (action) {
        case 'accept_case':
            newStatus = 'Under Investigation';
            logAction = 'Accepted Case';
            narrativeUpdate = `Case accepted for investigation by ${profile?.full_name || user.email}.`;
            break;
        case 'refer_case':
            newStatus = 'Referred';
            logAction = 'Referred Case';
            narrativeUpdate = `Case referred to: ${input}.`;
            resolutionDetails = {
                type: 'Referred',
                agency: input,
                date: new Date().toISOString(),
                officer: profile?.full_name || user.email
            };

            // Update status and resolution in database first
            await supabase
                .from('cases')
                .update({
                    status: newStatus,
                    resolution_details: resolutionDetails,
                    updated_at: new Date().toISOString()
                })
                .eq('id', caseId);

            // Append to narrative
            const { data: referralCase } = await supabase.from('cases').select('narrative_action').eq('id', caseId).single();
            const referralNarrative = referralCase?.narrative_action || '';
            const referralTimestamp = new Date().toLocaleString();
            const newReferralNarrative = `${referralNarrative ? referralNarrative + '\n' : ''}[${referralTimestamp}] ${narrativeUpdate}`;

            await supabase
                .from('cases')
                .update({ narrative_action: newReferralNarrative })
                .eq('id', caseId);

            // Log to audit
            await supabase.from('audit_logs').insert({
                user_id: user.id,
                action: logAction,
                details: {
                    action_key: 'refer_case',
                    input: input,
                    new_status: newStatus,
                    resolution: resolutionDetails
                },
                case_id: caseId
            });

            revalidatePath(`/dashboard/cases/${caseId}`);

            return {
                success: true,
                message: 'Referral document is being generated...',
                downloadUrl: `/api/documents/download?caseId=${caseId}&formType=referral`
            };
        case 'dismiss_case':
            newStatus = 'Dismissed';
            logAction = 'Dismissed Case';
            narrativeUpdate = `Case dismissed. Reason: ${input}.`;
            resolutionDetails = {
                type: 'Dismissed',
                reason: input,
                date: new Date().toISOString(),
                officer: profile?.full_name || user.email
            };
            break;
        case 'schedule_hearing':
            let hearingDate = input!;
            let hearingType = 'Mediation';

            try {
                const parsed = JSON.parse(input!);
                if (parsed.date && parsed.type) {
                    hearingDate = parsed.date;
                    hearingType = parsed.type;
                }
            } catch (e) {
                // Fallback to simple string if not JSON (backward compatibility)
                hearingDate = input!;
            }

            newStatus = 'Hearing Scheduled';
            logAction = 'Scheduled Hearing';
            narrativeUpdate = `${hearingType} hearing scheduled for: ${new Date(hearingDate).toLocaleString()}.`;

            // Insert into hearings table
            const { error: hearingError } = await supabase.from('hearings').insert({
                case_id: caseId,
                hearing_date: hearingDate,
                hearing_type: hearingType,
                status: 'Scheduled',
                notes: 'Scheduled via Action Bar'
            });

            if (hearingError) {
                return { error: 'Failed to create hearing record: ' + hearingError.message };
            }

            // Update case status
            await supabase
                .from('cases')
                .update({
                    status: newStatus,
                    updated_at: new Date().toISOString()
                })
                .eq('id', caseId);

            // Append to narrative
            const { data: hearingCase } = await supabase.from('cases').select('narrative_action').eq('id', caseId).single();
            const hearingNarrative = hearingCase?.narrative_action || '';
            const hearingTimestamp = new Date().toLocaleString();
            const newHearingNarrative = `${hearingNarrative ? hearingNarrative + '\n' : ''}[${hearingTimestamp}] ${narrativeUpdate}`;

            await supabase
                .from('cases')
                .update({ narrative_action: newHearingNarrative })
                .eq('id', caseId);

            // Log to audit
            await supabase.from('audit_logs').insert({
                user_id: user.id,
                action: logAction,
                details: {
                    action_key: 'schedule_hearing',
                    input: input,
                    new_status: newStatus,
                    hearing_date: hearingDate,
                    hearing_type: hearingType
                },
                case_id: caseId
            });

            revalidatePath(`/dashboard/cases/${caseId}`);

            return {
                success: true,
                message: 'Hearing scheduled. Notice of Hearing is being generated...',
                downloadUrl: `/api/documents/download?caseId=${caseId}&formType=hearing`
            };
        case 'issue_summon':
            logAction = 'Issued Summon';
            narrativeUpdate = `Summon issued.`;
            return {
                success: true,
                message: 'Summon document is being generated...',
                downloadUrl: `/api/documents/download?caseId=${caseId}&formType=summons`
            };
        case 'settle_case':
            newStatus = 'Settled';
            logAction = 'Settled Case';
            narrativeUpdate = `Case settled. Terms: ${input}.`;
            resolutionDetails = {
                type: 'Settled',
                terms: input,
                date: new Date().toISOString(),
                officer: profile?.full_name || user.email
            };

            // Update status and resolution in database first
            await supabase
                .from('cases')
                .update({
                    status: newStatus,
                    resolution_details: resolutionDetails,
                    updated_at: new Date().toISOString()
                })
                .eq('id', caseId);

            // Append to narrative
            const { data: settlementCase } = await supabase.from('cases').select('narrative_action').eq('id', caseId).single();
            const settlementNarrative = settlementCase?.narrative_action || '';
            const settlementTimestamp = new Date().toLocaleString();
            const newSettlementNarrative = `${settlementNarrative ? settlementNarrative + '\n' : ''}[${settlementTimestamp}] ${narrativeUpdate}`;

            await supabase
                .from('cases')
                .update({ narrative_action: newSettlementNarrative })
                .eq('id', caseId);

            // Log to audit
            await supabase.from('audit_logs').insert({
                user_id: user.id,
                action: logAction,
                details: {
                    action_key: 'settle_case',
                    input: input,
                    new_status: newStatus,
                    resolution: resolutionDetails
                },
                case_id: caseId
            });

            revalidatePath(`/dashboard/cases/${caseId}`);

            return {
                success: true,
                message: 'Case settled. Settlement document is being generated...',
                downloadUrl: `/api/documents/download?caseId=${caseId}&formType=settlement`
            };
        case 'reschedule_hearing':
            newStatus = 'Hearing Scheduled';
            logAction = 'Rescheduled Hearing';

            let reschedDate = input!;
            let reschedType = 'Mediation'; // Default

            // Parse JSON if available
            try {
                const parsed = JSON.parse(input!);
                if (parsed.date && parsed.type) {
                    reschedDate = parsed.date;
                    reschedType = parsed.type;
                }
            } catch (e) {
                reschedDate = input!;
            }

            narrativeUpdate = `Hearing rescheduled to: ${new Date(reschedDate).toLocaleString()} (${reschedType}).`;

            // Find the active hearing
            const { data: activeHearing } = await supabase
                .from('hearings')
                .select('id, hearing_type')
                .eq('case_id', caseId)
                .in('status', ['Scheduled', 'Rescheduled'])
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (activeHearing) {
                // If type wasn't in input (legacy), keep existing type
                if (!input!.includes('{')) {
                    reschedType = activeHearing.hearing_type;
                }

                await supabase.from('hearings').update({
                    hearing_date: reschedDate,
                    hearing_type: reschedType,
                    status: 'Rescheduled',
                    notes: `Rescheduled to ${reschedDate} (${reschedType})`
                }).eq('id', activeHearing.id);
            } else {
                // Create if missing
                await supabase.from('hearings').insert({
                    case_id: caseId,
                    hearing_date: reschedDate,
                    hearing_type: reschedType,
                    status: 'Rescheduled',
                    notes: 'Rescheduled (No previous active hearing found)'
                });
            }
            break;
        case 'reopen_case':
            newStatus = 'Under Investigation';
            logAction = 'Re-opened Case';
            narrativeUpdate = `Case re-opened. Reason: ${input}.`;
            // Clear resolution details on re-open
            resolutionDetails = null;
            break;
        case 'issue_cfa':
            newStatus = 'Closed';
            logAction = 'Issued Certificate to File Action';
            narrativeUpdate = `Certificate to File Action issued. Reason: ${input}.`;
            resolutionDetails = {
                type: 'CFA Issued',
                reason: input,
                date: new Date().toISOString(),
                officer: profile?.full_name || user.email
            };

            // Update status and resolution in database first
            await supabase
                .from('cases')
                .update({
                    status: newStatus,
                    resolution_details: resolutionDetails,
                    updated_at: new Date().toISOString()
                })
                .eq('id', caseId);

            // Append to narrative
            const { data: cfaCase } = await supabase.from('cases').select('narrative_action').eq('id', caseId).single();
            const cfaNarrative = cfaCase?.narrative_action || '';
            const cfaTimestamp = new Date().toLocaleString();
            const newCfaNarrative = `${cfaNarrative ? cfaNarrative + '\n' : ''}[${cfaTimestamp}] ${narrativeUpdate}`;

            await supabase
                .from('cases')
                .update({ narrative_action: newCfaNarrative })
                .eq('id', caseId);

            // Log to audit
            await supabase.from('audit_logs').insert({
                user_id: user.id,
                action: logAction,
                details: {
                    action_key: 'issue_cfa',
                    input: input,
                    new_status: newStatus,
                    resolution: resolutionDetails
                },
                case_id: caseId
            });

            revalidatePath(`/dashboard/cases/${caseId}`);

            return {
                success: true,
                message: 'CFA document is being generated...',
                downloadUrl: `/api/documents/download?caseId=${caseId}&formType=cfa`
            };
        default:
            return { error: 'Invalid action' };
    }

    // Update Case Status and Resolution Details
    if (newStatus || resolutionDetails !== undefined) {
        const updateData: any = { updated_at: new Date().toISOString() };
        if (newStatus) updateData.status = newStatus;
        if (resolutionDetails !== undefined) updateData.resolution_details = resolutionDetails;

        const { error: statusError } = await supabase
            .from('cases')
            .update(updateData)
            .eq('id', caseId)

        if (statusError) return { error: statusError.message }
    }

    // Append to Narrative Action (Action Taken)
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
            new_status: newStatus,
            resolution: resolutionDetails
        },
        case_id: caseId
    })

    revalidatePath(`/dashboard/cases/${caseId}`)
    return { success: true, message: `Action "${logAction}" completed.` }
}

// --- Hearing Management Actions ---

export async function scheduleHearing(caseId: string, date: string, type: string, notes: string) {
    const supabase = await createClient()

    if (await isCaseTerminal(supabase, caseId)) {
        return { error: 'Cannot modify a closed or settled case' }
    }

    // 1. Insert Hearing
    const { error } = await supabase.from('hearings').insert({
        case_id: caseId,
        hearing_date: date,
        hearing_type: type,
        notes: notes,
        status: 'Scheduled'
    })

    if (error) {
        console.error('Error scheduling hearing:', error)
        return { error: 'Failed to schedule hearing.' }
    }

    // 2. Update Case Status if needed
    await supabase.from('cases').update({ status: 'Hearing Scheduled' }).eq('id', caseId)

    // 3. Log to Narrative
    const timestamp = new Date().toLocaleString()
    const narrativeEntry = `\n[${timestamp}] ${type} scheduled for ${new Date(date).toLocaleString()}. ${notes}`

    // Fetch current narrative to append
    const { data: caseData } = await supabase.from('cases').select('narrative_action').eq('id', caseId).single()
    const currentNarrative = caseData?.narrative_action || ''

    await supabase.from('cases').update({
        narrative_action: currentNarrative + narrativeEntry
    }).eq('id', caseId)

    // 4. Audit Log
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('audit_logs').insert({
        case_id: caseId,
        action: 'Schedule Hearing',
        performed_by: user?.id,
        details: { date, type, notes }
    })

    revalidatePath(`/dashboard/cases/${caseId}`)
    return { success: true, message: 'Hearing scheduled successfully.' }
}

export async function updateHearingStatus(hearingId: string, caseId: string, status: string, outcomeNotes: string) {
    const supabase = await createClient()

    if (await isCaseTerminal(supabase, caseId)) {
        return { error: 'Cannot modify a closed or settled case' }
    }

    // 1. Update Hearing
    const { error } = await supabase.from('hearings').update({
        status: status,
        notes: outcomeNotes // Append or replace notes? Let's just update for now, or maybe append in UI.
    }).eq('id', hearingId)

    if (error) {
        return { error: 'Failed to update hearing.' }
    }

    // 2. Log to Narrative
    const timestamp = new Date().toLocaleString()
    const narrativeEntry = `\n[${timestamp}] Hearing marked as ${status}. ${outcomeNotes}`

    const { data: caseData } = await supabase.from('cases').select('narrative_action').eq('id', caseId).single()
    const currentNarrative = caseData?.narrative_action || ''

    await supabase.from('cases').update({
        narrative_action: currentNarrative + narrativeEntry
    }).eq('id', caseId)

    revalidatePath(`/dashboard/cases/${caseId}`)
    return { success: true, message: `Hearing marked as ${status}.` }
}

export async function deleteHearing(hearingId: string, caseId: string) {
    const supabase = await createClient()

    if (await isCaseTerminal(supabase, caseId)) {
        return { error: 'Cannot modify a closed or settled case' }
    }

    const { error } = await supabase.from('hearings').delete().eq('id', hearingId)

    if (error) {
        return { error: 'Failed to delete hearing.' }
    }

    revalidatePath(`/dashboard/cases/${caseId}`)
    return { success: true, message: 'Hearing deleted.' }
}
