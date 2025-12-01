'use client'

import { useState, useEffect } from 'react'

interface PrintableDocumentProps {
    type: string
    caseData: any
    complainants: any[]
    respondents: any[]
    details: any
    initialTitle: string
    initialBody: string
    officerName: string
    settings?: any
}

export default function PrintableDocument({
    type,
    caseData,
    complainants,
    respondents,
    details,
    initialTitle,
    initialBody,
    officerName,
    settings
}: PrintableDocumentProps) {
    const [title, setTitle] = useState(initialTitle)
    const [body, setBody] = useState(initialBody)
    const [date, setDate] = useState(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))

    // Auto-resize textarea logic could go here, but contentEditable is easier for "document" feel

    return (
        <div className="min-h-screen bg-gray-100 p-8 print:p-0 print:bg-white">
            {/* Toolbar - Hidden on Print */}
            <div className="max-w-[8.5in] mx-auto mb-8 flex justify-between items-center print:hidden">
                <div className="text-sm text-gray-600">
                    <p><strong>Tip:</strong> You can click on any text below to edit it before printing.</p>
                </div>
                <button
                    onClick={() => window.print()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 font-medium flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                    Print Document
                </button>
            </div>

            {/* Paper Container */}
            <div className="max-w-[8.5in] mx-auto bg-white p-12 shadow-lg print:shadow-none print:p-0 text-black font-serif leading-relaxed">

                {/* Header */}
                <div className="text-center mb-12 cursor-text" contentEditable suppressContentEditableWarning>
                    <p className="text-sm">Republic of the Philippines</p>
                    <p className="text-sm">Province of {settings?.province || '[Province]'}</p>
                    <p className="text-sm">City/Municipality of {settings?.city_municipality || '[City]'}</p>
                    <p className="text-sm font-bold uppercase">Barangay {settings?.barangay_name || '[Barangay Name]'}</p>
                    <h1 className="text-xl font-bold mt-2">OFFICE OF THE LUPONG TAGAPAMAYAPA</h1>
                </div>

                {/* Case Info */}
                <div className="flex justify-between mb-8 border-b pb-4">
                    <div className="w-1/2 pr-4 border-r">
                        <p className="font-bold mb-2">COMPLAINANT/S:</p>
                        <div contentEditable suppressContentEditableWarning>
                            {complainants.map((c: any) => (
                                <p key={c.id}>{c.name}</p>
                            ))}
                        </div>
                    </div>
                    <div className="w-1/2 pl-4">
                        <p className="font-bold mb-2">RESPONDENT/S:</p>
                        <div contentEditable suppressContentEditableWarning>
                            {respondents.map((r: any) => (
                                <p key={r.id}>{r.name}</p>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mb-8 flex justify-between items-end">
                    <div className="text-sm italic text-gray-500 print:hidden">
                        (Edit case number/nature if needed)
                    </div>
                    <div className="text-right" contentEditable suppressContentEditableWarning>
                        <p className="text-sm">Case No. {caseData.case_number}</p>
                        <p className="text-sm">For: {caseData.incident_type}</p>
                    </div>
                </div>

                {/* Title */}
                <h2
                    className="text-2xl font-bold text-center mb-10 underline uppercase cursor-text outline-none focus:bg-yellow-50"
                    contentEditable
                    suppressContentEditableWarning
                >
                    {title}
                </h2>

                {/* Body */}
                <div
                    className="text-lg leading-relaxed mb-16 whitespace-pre-wrap outline-none focus:bg-yellow-50 p-2 -ml-2 rounded"
                    contentEditable
                    suppressContentEditableWarning
                    dangerouslySetInnerHTML={{ __html: body }}
                />

                {/* Footer / Signatures */}
                <div className="mt-20">
                    <p className="mb-12">
                        Issued this <span contentEditable suppressContentEditableWarning className="outline-none focus:bg-yellow-50">{date}</span> at Barangay {settings?.barangay_name || '[Name]'}, {settings?.city_municipality || '[City/Municipality]'}.
                    </p>

                    <div className="flex justify-between items-end">
                        <div className="text-center">
                            {type === 'settlement' && (
                                <>
                                    <div className="mb-8 pt-8 border-t border-black w-48 mx-auto">Complainant Signature</div>
                                    <div className="pt-8 border-t border-black w-48 mx-auto">Respondent Signature</div>
                                </>
                            )}
                        </div>

                        <div className="text-center">
                            <p className="mb-8">Certified by:</p>
                            <p className="font-bold uppercase outline-none focus:bg-yellow-50" contentEditable suppressContentEditableWarning>{settings?.barangay_secretary || officerName}</p>
                            <p className="text-sm" contentEditable suppressContentEditableWarning>Barangay Secretary / Lupon Member</p>
                        </div>
                    </div>

                    <div className="text-center mt-16">
                        <p>Attested by:</p>
                        <br />
                        <p className="font-bold uppercase outline-none focus:bg-yellow-50" contentEditable suppressContentEditableWarning>HON. {settings?.punong_barangay || '[PUNONG BARANGAY]'}</p>
                        <p className="text-sm" contentEditable suppressContentEditableWarning>Punong Barangay / Lupon Chairman</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
