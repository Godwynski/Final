import React from 'react'
import DocumentHeader from '../DocumentHeader'
import DocumentFooter from '../DocumentFooter'

export default function ReferralForm({ caseData, complainants, respondents, settings }: { caseData: any, complainants: any[], respondents: any[], settings: any }) {
    const referralDetails = caseData.resolution_details || {}
    const agency = referralDetails.agency || '[Name of Agency/Office]'

    return (
        <div className="max-w-[210mm] mx-auto bg-white p-8 min-h-screen text-black font-serif relative">
            <DocumentHeader settings={settings} />

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

            <h1 className="text-2xl font-bold text-center uppercase mb-8 underline">ENDORSEMENT</h1>
            <p className="text-center text-sm mb-8 font-bold">(KP Form No. 23)</p>

            <div className="space-y-6 text-justify leading-relaxed outline-none" contentEditable suppressContentEditableWarning>
                <p>
                    Respectfully indorsed to the <span className="font-bold underline">{agency}</span> the herein complaint of <span className="font-bold uppercase">{complainants.map(c => c.name).join(', ')}</span> against <span className="font-bold uppercase">{respondents.map(r => r.name).join(', ')}</span> for <span className="font-bold">{caseData.incident_type}</span>.
                </p>

                <p className="indent-8">
                    This Barangay has conducted the necessary proceedings. However, it was determined that:
                </p>

                <div className="ml-8 space-y-2">
                    <p>[ &nbsp; ] This office has no jurisdiction over the dispute.</p>
                    <p>[ &nbsp; ] The parties failed to reach an amicable settlement.</p>
                    <p>[ &nbsp; ] The case is not suitable for mediation/conciliation.</p>
                </div>

                <p className="indent-8">
                    Therefore, this case is hereby referred to your good office for appropriate action.
                </p>

                <p className="indent-8">
                    Attached herewith are the copies of the complaint and other related documents.
                </p>
            </div>

            <div className="mt-16">
                <p className="mb-8">Submitted by:</p>
                <DocumentFooter settings={settings} type="both" />
            </div>
        </div>
    )
}
