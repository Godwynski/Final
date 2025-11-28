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

    // Log action
    await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'Created Case',
        details: { case_id: data.id, title: data.title },
    })

    revalidatePath('/dashboard')
    redirect(`/dashboard/cases/${data.id}`)
}
