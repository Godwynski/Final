'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createCaseSchema } from '@/utils/validation'

export async function createCase(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const rawData = {
        title: formData.get('title'),
        incident_type: formData.get('incident_type'),
        narrative_facts: formData.get('narrative_facts'),
        narrative_action: formData.get('narrative_action'),
        incident_date: formData.get('incident_date'),
        incident_location: formData.get('incident_location'),
    }

    const validationResult = createCaseSchema.safeParse(rawData)

    if (!validationResult.success) {
        return { error: validationResult.error.issues[0].message }
    }

    const { title, incident_type, narrative_facts, narrative_action, incident_date, incident_location } = validationResult.data

    // Parse parties
    let parties = []
    try {
        const partiesJson = formData.get('involved_parties') as string
        if (partiesJson) {
            parties = JSON.parse(partiesJson)
        }
    } catch (e) {
        console.error('Error parsing parties:', e)
    }

    // Legacy Description for backward compatibility
    const description = `[${incident_type}] FACTS: ${narrative_facts}\n\nACTION TAKEN: ${narrative_action || 'None'}`

    const { data, error } = await supabase
        .from('cases')
        .insert({
            title,
            incident_type,
            narrative_facts,
            narrative_action,
            description,
            incident_date: new Date(incident_date).toISOString(),
            incident_location,
            reported_by: user.id,
            status: 'New',
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating case:', error)
        return { error: error.message }
    }

    // Insert parties
    if (parties.length > 0) {
        const partiesToInsert = parties.map((p: any) => ({
            case_id: data.id,
            name: p.name,
            type: p.type,
            contact_number: p.contact_number,
            email: p.email,
            address: p.address
        }))

        const { error: partiesError } = await supabase
            .from('involved_parties')
            .insert(partiesToInsert)

        if (partiesError) {
            console.error('Error inserting parties:', partiesError)
            // Manual Rollback: Delete the case if parties failed to insert
            await supabase.from('cases').delete().eq('id', data.id)
            return { error: 'Failed to save involved parties. Case creation cancelled.' }
        }
    }

    // Log action
    await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'Created Case',
        details: { case_id: data.id, title: data.title },
    })

    // Create Notification for Admins (if high priority)
    if (['Physical Injury', 'Theft', 'Harassment'].includes(incident_type)) {
        // Find admins
        const { data: admins } = await supabase
            .from('profiles')
            .select('id')
            .eq('role', 'admin')

        if (admins && admins.length > 0) {
            const notifications = admins.map(admin => ({
                user_id: admin.id,
                title: 'New High Priority Case',
                message: `A new ${incident_type} case has been reported: ${title}`,
                link: `/dashboard/cases/${data.id}`
            }))

            await supabase.from('notifications').insert(notifications)
        }
    }

    revalidatePath('/dashboard')
    redirect(`/dashboard/cases/${data.id}`)
}

export async function searchParties(query: string) {
    const supabase = await createClient()

    if (!query || query.length < 2) return []

    const { data, error } = await supabase
        .from('involved_parties')
        .select('name, contact_number, email, address')
        .ilike('name', `%${query}%`)
        .limit(5)

    if (error) {
        console.error('Error searching parties:', error)
        return []
    }

    // Deduplicate by name
    const unique = data.filter((v, i, a) => a.findIndex(t => t.name === v.name) === i)

    return unique
}
