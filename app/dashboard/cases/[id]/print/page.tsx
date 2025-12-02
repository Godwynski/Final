import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import PrintButton from '@/components/PrintButton'
import SummonsForm from '@/components/documents/forms/SummonsForm'
import NoticeOfHearingForm from '@/components/documents/forms/NoticeOfHearingForm'
import CertificateToFileActionForm from '@/components/documents/forms/CertificateToFileActionForm'
import AmicableSettlementForm from '@/components/documents/forms/AmicableSettlementForm'

export default async function PrintDocumentPage(props: { params: Promise<{ id: string }>, searchParams: Promise<{ form?: string }> }) {
    const params = await props.params
    const searchParams = await props.searchParams
    const supabase = await createClient()
    const { id } = params
    const formType = searchParams.form || 'summons'

    // Fetch Case Data
    const { data: caseData } = await supabase.from('cases').select('*').eq('id', id).single()
    const { data: parties } = await supabase.from('involved_parties').select('*').eq('case_id', id)
    const { data: settings } = await supabase.from('barangay_settings').select('*').single()

    if (!caseData) return notFound()

    const complainants = parties?.filter(p => p.type === 'Complainant') || []
    const respondents = parties?.filter(p => p.type === 'Respondent') || []

    return (
        <div className="bg-gray-100 min-h-screen print:bg-white">
            {formType === 'summons' && (
                <SummonsForm
                    caseData={caseData}
                    complainants={complainants}
                    respondents={respondents}
                    settings={settings}
                />
            )}

            {formType === 'hearing' && (
                <NoticeOfHearingForm
                    caseData={caseData}
                    complainants={complainants}
                    respondents={respondents}
                    settings={settings}
                />
            )}

            {formType === 'cfa' && (
                <CertificateToFileActionForm
                    caseData={caseData}
                    complainants={complainants}
                    respondents={respondents}
                    settings={settings}
                />
            )}

            {formType === 'settlement' && (
                <AmicableSettlementForm
                    caseData={caseData}
                    complainants={complainants}
                    respondents={respondents}
                    settings={settings}
                />
            )}

            {/* Print Controls (Hidden on Print) */}
            <div className="fixed bottom-8 right-8 print:hidden flex gap-4">
                <PrintButton />
            </div>
        </div>
    )
}
