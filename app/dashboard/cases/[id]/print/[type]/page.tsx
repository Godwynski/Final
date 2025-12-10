import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import PrintableDocument from '@/components/PrintableDocument'
import { InvolvedParty, ResolutionDetails } from '@/types'

export default async function PrintPage({ params }: { params: Promise<{ id: string, type: string }> }) {
    const { id, type } = await params
    const supabase = await createClient()

    // Fetch Case Data and Settings
    const [caseRes, settingsRes] = await Promise.all([
        supabase
            .from('cases')
            .select(`
                *,
                involved_parties (*),
                profiles:reported_by (full_name, email)
            `)
            .eq('id', id)
            .single(),
        supabase.from('barangay_settings').select('*').single()
    ])

    const caseData = caseRes.data
    const settings = settingsRes.data || null

    if (caseRes.error || !caseData) {
        notFound()
    }

    // Helper to get parties by type
    const complainants = caseData.involved_parties.filter((p: InvolvedParty) => p.type === 'Complainant')
    const respondents = caseData.involved_parties.filter((p: InvolvedParty) => p.type === 'Respondent')

    // Resolution Details
    const details = caseData.resolution_details || {}

    // Document Configuration based on Type
    let docTitle = ''
    let docBody = ''
    let kpFormNo = ''

    switch (type) {
        case 'referral':
            docTitle = 'REFERRAL LETTER'
            kpFormNo = '23' // KP Form No. 23: Referral
            docBody = `
                <div class="space-y-6">
                    <p><strong>TO: ${details.agency || '[AGENCY NAME]'}</strong></p>
                    <p><strong>SUBJECT: Indorsement of Case No. ${caseData.case_number}</strong></p>
                    <p class="indent-8 text-justify">
                        Respectfully indorsed to your good office is the complaint of <strong>${complainants.map((c: InvolvedParty) => c.name).join(', ')}</strong> against <strong>${respondents.map((r: InvolvedParty) => r.name).join(', ')}</strong> regarding the incident of <strong>${caseData.incident_type}</strong> which occurred on ${new Date(caseData.incident_date).toLocaleDateString()}.
                    </p>
                    <p class="indent-8 text-justify">
                        This Barangay has conducted the necessary proceedings. However, it was determined that this office has no jurisdiction over the matter / the parties failed to reach an amicable settlement, hence this referral for your appropriate action.
                    </p>
                    <p class="indent-8 text-justify">
                        Attached herewith are the copies of the complaint and other related documents.
                    </p>
                </div>
            `
            break

        case 'dismissal':
            docTitle = 'ORDER OF DISMISSAL'
            kpFormNo = '16' // KP Form No. 16: Order of Dismissal
            docBody = `
                <div class="space-y-6">
                    <p class="indent-8 text-justify">
                        After a careful review of the complaint filed by <strong>${complainants.map((c: InvolvedParty) => c.name).join(', ')}</strong> against <strong>${respondents.map((r: InvolvedParty) => r.name).join(', ')}</strong>, this Office hereby orders the <strong>DISMISSAL</strong> of the instant case.
                    </p>
                    <p><strong>REASON FOR DISMISSAL:</strong></p>
                    <div class="p-4 border border-gray-300 bg-gray-50 italic">
                        ${details.reason || caseData.narrative_action || 'No reason specified.'}
                    </div>
                    <p class="indent-8 text-justify">
                        This order is issued without prejudice to the filing of the appropriate action in court or other government agencies if the cause of action is not barred by the Statute of Limitations.
                    </p>
                </div>
            `
            break

        case 'settlement':
            docTitle = 'AMICABLE SETTLEMENT'
            kpFormNo = '7' // KP Form No. 7: Amicable Settlement
            docBody = `
                <div class="space-y-6">
                    <p class="indent-8 text-justify">
                        We, complainant/s and respondent/s in the above-captioned case, do hereby agree to settle our dispute as follows:
                    </p>
                    <div class="p-6 border border-gray-300 min-h-[150px] whitespace-pre-wrap">
                        ${details.terms || 'Terms of settlement as agreed upon by both parties.'}
                    </div>
                    <p class="indent-8 text-justify">
                        We bind ourselves to comply honestly and faithfully with the above terms of settlement.
                    </p>
                </div>
            `
            break

        case 'cfa':
            docTitle = 'CERTIFICATE TO FILE ACTION'
            kpFormNo = '20' // KP Form No. 20: Certificate to File Action
            docBody = `
                <div class="space-y-6">
                    <p class="indent-8 text-justify">
                        This is to certify that a complaint for <strong>${caseData.incident_type}</strong> was filed by <strong>${complainants.map((c: InvolvedParty) => c.name).join(', ')}</strong> against <strong>${respondents.map((r: InvolvedParty) => r.name).join(', ')}</strong>.
                    </p>
                    <p class="indent-8 text-justify">
                        That there has been a personal confrontation between the parties before the Punong Barangay/Pangkat ng Tagapagkasundo but:
                    </p>
                    <ul class="list-disc ml-12 space-y-2">
                        <li>[ ${details.reason?.includes('mediation') ? 'X' : ' '} ] No settlement was reached.</li>
                        <li>[ ${details.reason?.includes('appear') ? 'X' : ' '} ] The Respondent failed to appear without valid reason.</li>
                        <li>[ ${details.reason?.includes('repudiated') ? 'X' : ' '} ] The settlement was repudiated.</li>
                    </ul>
                    <p class="indent-8 text-justify mt-4">
                        Therefore, the corresponding complaint for the dispute may now be filed in court/government office.
                    </p>
                </div>
            `
            break

        default:
            docTitle = 'CASE RECORD'
            kpFormNo = ''
            docBody = `
                <div class="space-y-4">
                    <p><strong>Status:</strong> ${caseData.status}</p>
                    <p><strong>Narrative:</strong> ${caseData.narrative_facts}</p>
                    <p><strong>Action Taken:</strong> ${caseData.narrative_action}</p>
                </div>
            `
    }

    return (
        <PrintableDocument
            type={type}
            caseData={caseData}
            complainants={complainants}
            respondents={respondents}
            details={{ ...details, kp_form_no: kpFormNo }}
            initialTitle={docTitle}
            initialBody={docBody}
            officerName={caseData.profiles?.full_name || '____________________'}
            settings={settings}
        />
    )
}
