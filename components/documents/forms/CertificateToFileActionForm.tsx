import React from 'react'
import DocumentHeader from '../DocumentHeader'
import DocumentFooter from '../DocumentFooter'

interface CertificateToFileActionFormProps {
    caseData: any
    complainants: any[]
    respondents: any[]
    settings: any
}

export default function CertificateToFileActionForm({ caseData, complainants, respondents, settings }: CertificateToFileActionFormProps) {
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

            <h1 className="text-2xl font-bold text-center uppercase mb-8 underline">CERTIFICATE TO FILE ACTION</h1>
            <p className="text-center text-sm mb-8 font-bold">(KP Form No. 20)</p>

            <p className="mb-4 text-justify indent-8 leading-relaxed">
                This is to certify that a complaint for <span className="font-bold">{caseData.incident_type}</span> was filed
                by the complainant(s) against the respondent(s) in this office.
            </p>
            <p className="mb-4 text-justify indent-8 leading-relaxed">
                That there has been a personal confrontation between the parties before the Punong Barangay/Pangkat Tagapagkasundo
                but mediation failed and/or no settlement was reached.
            </p>
            <p className="mb-8 text-justify indent-8 leading-relaxed">
                Therefore, the corresponding complaint for the dispute may now be filed in court/government office.
            </p>

            <DocumentFooter settings={settings} type="both" />
        </div>
    )
}
