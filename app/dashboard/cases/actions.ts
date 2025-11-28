'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCase(formData: FormData) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const incident_date = formData.get('incident_date') as string
    const incident_location = formData.get('incident_location') as string

    // Validate Incident Date
    const incidentDateObj = new Date(incident_date)
    const now = new Date()

    if (incidentDateObj > now) {
        redirect(`/dashboard/cases/new?error=Incident date cannot be in the future`)
    }

    const { data, error } = await supabase
        .from('cases')
        .insert({
            title,
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
        redirect(`/dashboard/cases/new?error=${encodeURIComponent(error.message)}`)
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
