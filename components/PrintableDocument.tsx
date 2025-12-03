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
            <style jsx global>{`
                @media print {
                    @page {
                        size: letter;
                        margin: 0.5in;
                    }
                    body {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            `}</style>

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
            <div className="max-w-[8.5in] mx-auto bg-white p-12 shadow-lg print:shadow-none print:p-0 text-black font-serif leading-relaxed relative">

                {/* KP Form Number - Top Right */}
                <div className="absolute top-8 right-12 text-sm font-bold print:top-0 print:right-0">
                    <span contentEditable suppressContentEditableWarning>KP Form No. {details?.kp_form_no || '___'}</span>
                </div>

                {/* Header with Logos */}
                <div className="flex justify-between items-center mb-8 pt-4">
                    <div className="w-24 h-24 flex items-center justify-center">
                        {settings?.logo_barangay_url ? (
                            <div className="relative w-full h-full">
                                <img src={settings.logo_barangay_url} alt="Barangay Logo" className="w-full h-full object-contain" />
                            </div>
                        ) : (
                            <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center text-xs text-center text-gray-400">
                                Brgy Logo
                            </div>
                        )}
                    </div>

                    <div className="text-center flex-1 px-4 cursor-text" contentEditable suppressContentEditableWarning>
                        <p className="text-sm">Republic of the Philippines</p>
                        <p className="text-sm">Province of {settings?.province || '[Province]'}</p>
                        <p className="text-sm">City/Municipality of {settings?.city_municipality || '[City]'}</p>
                        <p className="text-sm font-bold uppercase mt-1">Barangay {settings?.barangay_name || '[Barangay Name]'}</p>
                        <h1 className="text-xl font-bold mt-4 font-sans">OFFICE OF THE LUPONG TAGAPAMAYAPA</h1>
                    </div>

                    <div className="w-24 h-24 flex items-center justify-center">
                        {settings?.logo_city_url ? (
                            <div className="relative w-full h-full">
                                <img src={settings.logo_city_url} alt="City Logo" className="w-full h-full object-contain" />
                            </div>
                        ) : (
                            <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center text-xs text-center text-gray-400">
                                City Logo
                            </div>
                        )}
                    </div>
                </div>

                {/* Case Info */}
                <div className="flex justify-between mb-8 border-b-2 border-black pb-4">
                    <div className="w-1/2 pr-4 border-r border-black">
                        <p className="font-bold mb-2 text-sm uppercase">Barangay Case No.</p>
                        <div contentEditable suppressContentEditableWarning className="font-bold text-lg">
                            {caseData.case_number}
                        </div>
                        <p className="font-bold mt-4 mb-2 text-sm uppercase">For:</p>
                        <div contentEditable suppressContentEditableWarning className="min-h-[1.5em]">
                            {caseData.incident_type}
                        </div>
                    </div>

                    <div className="w-1/2 pl-4 flex flex-col justify-between">
                        <div>
                            <p className="font-bold mb-2 text-sm uppercase">Complainant/s:</p>
                            <div contentEditable suppressContentEditableWarning className="mb-4">
                                {complainants.length > 0 ? complainants.map((c: any) => c.name).join(', ') : '[Enter Complainant Names]'}
                            </div>
                        </div>

                        <div className="text-center font-bold my-2">- against -</div>

                        <div>
                            <p className="font-bold mb-2 text-sm uppercase">Respondent/s:</p>
                            <div contentEditable suppressContentEditableWarning>
                                {respondents.length > 0 ? respondents.map((r: any) => r.name).join(', ') : '[Enter Respondent Names]'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Title */}
                <h2
                    className="text-2xl font-bold text-center mb-10 underline uppercase cursor-text outline-none focus:bg-yellow-50 font-sans tracking-wide"
                    contentEditable
                    suppressContentEditableWarning
                >
                    {title}
                </h2>

                {/* Body */}
                <div
                    className="text-lg leading-relaxed mb-16 whitespace-pre-wrap outline-none focus:bg-yellow-50 p-2 -ml-2 rounded text-justify"
                    contentEditable
                    suppressContentEditableWarning
                    dangerouslySetInnerHTML={{ __html: body }}
                />

                {/* Footer / Signatures */}
                <div className="mt-auto">
                    <p className="mb-12 text-justify indent-8">
                        Issued this <span contentEditable suppressContentEditableWarning className="outline-none focus:bg-yellow-50 font-bold underline decoration-dotted underline-offset-4">{date}</span> at Barangay {settings?.barangay_name || '[Name]'}, {settings?.city_municipality || '[City/Municipality]'}.
                    </p>

                    <div className="flex justify-between items-end gap-8">
                        {type === 'settlement' ? (
                            <>
                                <div className="text-center flex-1">
                                    <div className="mb-2 pt-8 border-t border-black w-full"></div>
                                    <p className="text-sm font-bold">Complainant/s</p>
                                </div>
                                <div className="text-center flex-1">
                                    <div className="mb-2 pt-8 border-t border-black w-full"></div>
                                    <p className="text-sm font-bold">Respondent/s</p>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1"></div>
                        )}

                        <div className="text-center flex-1">
                            <p className="mb-8 text-sm">Certified by:</p>
                            <p className="font-bold uppercase outline-none focus:bg-yellow-50 underline" contentEditable suppressContentEditableWarning>{settings?.barangay_secretary || officerName}</p>
                            <p className="text-xs font-bold uppercase" contentEditable suppressContentEditableWarning>Barangay Secretary</p>
                        </div>
                    </div>

                    <div className="text-center mt-16 max-w-xs mx-auto">
                        <p className="mb-8 text-sm">Attested by:</p>
                        <p className="font-bold uppercase outline-none focus:bg-yellow-50 underline" contentEditable suppressContentEditableWarning>HON. {settings?.punong_barangay || '[PUNONG BARANGAY]'}</p>
                        <p className="text-xs font-bold uppercase" contentEditable suppressContentEditableWarning>Punong Barangay / Lupon Chairman</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
