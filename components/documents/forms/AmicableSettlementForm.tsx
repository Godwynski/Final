import React from 'react'
import DocumentHeader from '../DocumentHeader'
import DocumentFooter from '../DocumentFooter'

interface AmicableSettlementFormProps {
    caseData: any
    complainants: any[]
    respondents: any[]
    settings: any
}

export default function AmicableSettlementForm({ caseData, complainants, respondents, settings }: AmicableSettlementFormProps) {
    return (
        <div className="max-w-[210mm] mx-auto p-8 bg-white min-h-screen text-black font-serif">
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

            <h1 className="text-2xl font-bold text-center uppercase mb-8 underline">AMICABLE SETTLEMENT</h1>
            <p className="text-center text-sm mb-8 font-bold">(KP Form No. 16)</p>

            <div className="outline-none" contentEditable suppressContentEditableWarning>
                <p className="mb-4 text-justify indent-8 leading-relaxed">
                    We, complainant(s) and respondent(s) in the above-captioned case, do hereby agree to settle our dispute as follows:
                </p>

                <div className="border border-black min-h-[200px] p-4 mb-8">
                    <p className="whitespace-pre-wrap">{caseData.resolution_details?.terms || '(Enter terms of settlement here...)'}</p>
                </div>

                <p className="mb-8 text-justify indent-8 leading-relaxed">
                    and bind ourselves to comply honestly and faithfully with the above terms of settlement.
                </p>

                <p className="mb-8">Entered into this <span className="font-bold underline">{new Date().toLocaleDateString()}</span>.</p>
            </div>

            <div
                className="flex justify-between items-start mt-16 mb-16"
                style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
            >
                <div className="text-center w-1/2">
                    <p className="font-bold uppercase border-t border-black pt-2 px-8 mx-8">Complainant(s)</p>
                </div>
                <div className="text-center w-1/2">
                    <p className="font-bold uppercase border-t border-black pt-2 px-8 mx-8">Respondent(s)</p>
                </div>
            </div>

            <DocumentFooter settings={settings} type="both" />
        </div>
    )
}
