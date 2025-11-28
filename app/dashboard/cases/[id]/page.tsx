import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import CaseDetailsClient from './CaseDetailsClient'

export default async function CaseDetailsPage(props: { params: Promise<{ id: string }>, searchParams: Promise<{ message?: string, error?: string }> }) {
    const params = await props.params
    const searchParams = await props.searchParams
    const supabase = await createClient()
    const { id } = params

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect('/login')

    // Fetch all case data in parallel
    const [caseRes, partiesRes, notesRes, evidenceRes, linksRes, logsRes] = await Promise.all([
        supabase.from('cases').select('*').eq('id', id).single(),
        supabase.from('involved_parties').select('*').eq('case_id', id),
        supabase.from('case_notes').select('*, profiles:created_by(email, full_name)').eq('case_id', id).order('created_at', { ascending: false }),
        supabase.from('evidence').select('*').eq('case_id', id),
        supabase.from('guest_links').select('*').eq('case_id', id).order('created_at', { ascending: false }),
        supabase.from('audit_logs').select('*, profiles:user_id(email, full_name)').eq('case_id', id).order('created_at', { ascending: false })
    ])

    if (caseRes.error || !caseRes.data) return notFound()

    const caseData = caseRes.data
    const parties = partiesRes.data || []
    const notes = notesRes.data || []
    const evidence = evidenceRes.data || []
    const allLinks = linksRes.data || []
    const logs = logsRes.data || []
    const userRole = user?.user_metadata?.role || 'staff'

    return (
        <CaseDetailsClient
            caseData={caseData}
            involvedParties={parties}
            evidence={evidence}
            notes={notes}
            auditLogs={logs}
            guestLinks={allLinks}
            userRole={userRole}
            userId={user?.id || ''}
        />
    )
}
