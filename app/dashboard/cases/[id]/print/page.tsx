import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PrintButton from '@/components/PrintButton'
import SummonsForm from '@/components/documents/forms/SummonsForm'
import NoticeOfHearingForm from '@/components/documents/forms/NoticeOfHearingForm'
import CertificateToFileActionForm from '@/components/documents/forms/CertificateToFileActionForm'
import AmicableSettlementForm from '@/components/documents/forms/AmicableSettlementForm'
import ReferralForm from '@/components/documents/forms/ReferralForm'

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
        <div className="bg-gray-100 min-h-screen print:bg-white print:min-h-0 print:h-auto print:overflow-visible">
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

            {formType === 'referral' && (
                <ReferralForm
                    caseData={caseData}
                    complainants={complainants}
                    respondents={respondents}
                    settings={settings}
                />
            )}


            {/* Print Controls (Hidden on Print) */}
            <div className="fixed bottom-8 right-8 print:hidden flex gap-4">
                <Link
                    href={`/dashboard/cases/${id}`}
                    className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700"
                >
                    Back to Case
                </Link>
                <PrintButton />
            </div>
        </div>
    )
}
