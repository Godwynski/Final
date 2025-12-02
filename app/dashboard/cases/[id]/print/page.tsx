import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'

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

    const barangayName = settings?.barangay_name || '[Barangay Name]'
    const city = settings?.city_municipality || '[City/Municipality]'
    const province = settings?.province || '[Province]'
    const captain = settings?.barangay_captain || '[Punong Barangay Name]'

    return (
        <div className="bg-white text-black p-8 max-w-[210mm] mx-auto min-h-screen">
            {/* Header */}
            <div className="text-center mb-8">
                <p className="text-sm">Republic of the Philippines</p>
                <p className="text-sm">Province of {province}</p>
                <p className="text-sm">City/Municipality of {city}</p>
                <p className="font-bold uppercase mt-2">Barangay {barangayName}</p>
                <p className="font-bold uppercase mt-4 text-xl">Office of the Lupong Tagapamayapa</p>
            </div>

            <div className="flex justify-between items-start mb-8">
                <div className="w-1/2">
                    {complainants.map((c, i) => (
                        <p key={i} className="font-bold uppercase">{c.name}</p>
                    ))}
                    <p className="text-sm italic">Complainant(s)</p>
                    <p className="text-center my-2 font-bold">- against -</p>
                    {respondents.map((r, i) => (
                        <p key={i} className="font-bold uppercase">{r.name}</p>
                    ))}
                    <p className="text-sm italic">Respondent(s)</p>
                </div>
                <div className="w-1/2 text-right">
                    <p>Barangay Case No.: <span className="font-bold">{caseData.case_number}</span></p>
                    <p>For: <span className="font-bold">{caseData.incident_type}</span></p>
                </div>
            </div>

            {/* Form Content */}
            {formType === 'summons' && (
                <div>
                    <h1 className="text-2xl font-bold text-center uppercase mb-8 underline">Summons</h1>
                    <p className="mb-4">TO: <span className="font-bold uppercase">{respondents.map(r => r.name).join(', ')}</span></p>
                    <p className="mb-4 text-justify indent-8">
                        You are hereby summoned to appear before me in person, together with your witnesses, on the
                        <span className="inline-block w-32 border-b border-black mx-1"></span> day of
                        <span className="inline-block w-32 border-b border-black mx-1"></span>, 20__, at
                        <span className="inline-block w-24 border-b border-black mx-1"></span> o'clock in the morning/afternoon,
                        then and there to answer to a complaint made before me, copy of which is attached herewith, for mediation/conciliation of your dispute with complainant/s.
                    </p>
                    <p className="mb-8 text-justify indent-8">
                        You are hereby warned that if you refuse or willfully fail to appear in obedience to this summons, you may be barred from filing any counterclaim arising from said complaint.
                    </p>
                    <p className="mb-8 text-justify indent-8">
                        FAIL NOT or else face punishment for contempt of court.
                    </p>
                    <div className="mt-16 text-right">
                        <div className="inline-block text-center">
                            <p className="font-bold uppercase border-t border-black pt-2 px-8">{captain}</p>
                            <p className="text-sm">Punong Barangay / Lupon Chairman</p>
                        </div>
                    </div>
                </div>
            )}

            {formType === 'hearing' && (
                <div>
                    <h1 className="text-2xl font-bold text-center uppercase mb-8 underline">Notice of Hearing</h1>
                    <p className="mb-4">TO: <span className="font-bold uppercase">{complainants.map(c => c.name).join(', ')} / {respondents.map(r => r.name).join(', ')}</span></p>
                    <p className="mb-4 text-justify indent-8">
                        You are hereby required to appear before me on the
                        <span className="inline-block w-32 border-b border-black mx-1"></span> day of
                        <span className="inline-block w-32 border-b border-black mx-1"></span>, 20__, at
                        <span className="inline-block w-24 border-b border-black mx-1"></span> o'clock in the morning/afternoon,
                        for the hearing of your dispute.
                    </p>
                    <div className="mt-16 text-right">
                        <div className="inline-block text-center">
                            <p className="font-bold uppercase border-t border-black pt-2 px-8">{captain}</p>
                            <p className="text-sm">Punong Barangay / Lupon Chairman</p>
                        </div>
                    </div>
                </div>
            )}

            {formType === 'cfa' && (
                <div>
                    <h1 className="text-2xl font-bold text-center uppercase mb-8 underline">Certificate to File Action</h1>
                    <p className="mb-4 text-justify indent-8">
                        This is to certify that a complaint for <span className="font-bold">{caseData.incident_type}</span> was filed
                        by the complainant(s) against the respondent(s) in this office.
                    </p>
                    <p className="mb-4 text-justify indent-8">
                        That there has been a personal confrontation between the parties before the Punong Barangay/Pangkat Tagapagkasundo
                        but mediation failed and/or no settlement was reached.
                    </p>
                    <p className="mb-8 text-justify indent-8">
                        Therefore, the corresponding complaint for the dispute may now be filed in court/government office.
                    </p>
                    <div className="mt-16 text-right">
                        <div className="inline-block text-center">
                            <p className="font-bold uppercase border-t border-black pt-2 px-8">{settings?.barangay_secretary || 'Secretary'}</p>
                            <p className="text-sm">Barangay Secretary</p>
                        </div>
                    </div>
                    <div className="mt-8 text-left">
                        <p>Attested by:</p>
                        <div className="inline-block text-center mt-8">
                            <p className="font-bold uppercase border-t border-black pt-2 px-8">{captain}</p>
                            <p className="text-sm">Punong Barangay / Lupon Chairman</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Print Controls (Hidden on Print) */}
            <div className="fixed bottom-8 right-8 print:hidden flex gap-4">
                <button
                    onClick={() => window.print()}
                    className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 font-bold flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                    Print Document
                </button>
            </div>
        </div>
    )
}
