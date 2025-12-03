import React from 'react'
import Image from 'next/image'
import DocumentHeader from '../DocumentHeader'
import DocumentFooter from '../DocumentFooter'

interface AbstractFormProps {
    caseData: any
    involvedParties: any[]
    settings: any
}

export default function AbstractForm({ caseData, involvedParties, settings }: AbstractFormProps) {
    const formattedDate = new Date(caseData.incident_date).toLocaleString()
    const generatedDate = new Date().toLocaleString()

    return (
        <div className="max-w-[210mm] mx-auto bg-white p-8 min-h-screen text-black font-serif relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 border-b-2 border-black pb-4">
                <div className="w-24 h-24 flex items-center justify-center">
                    {settings?.logo_barangay_url ? (
                        <img src={settings.logo_barangay_url} alt="Barangay Logo" className="w-full h-full object-contain" />
                    ) : (
                        <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center text-xs text-center text-gray-400">
                            Brgy Logo
                        </div>
                    )}
                </div>
                <div className="text-center flex-1 outline-none" contentEditable suppressContentEditableWarning>
                    <h1 className="text-xl font-bold uppercase tracking-wide font-serif">Republic of the Philippines</h1>
                    <p className="text-sm uppercase font-serif">Province of {settings?.province || '[Province Name]'}</p>
                    <p className="text-sm uppercase font-serif">City/Municipality of {settings?.city_municipality || '[City Name]'}</p>
                    <h2 className="text-2xl font-black uppercase mt-2 font-serif">Barangay {settings?.barangay_name || '[Barangay Name]'}</h2>
                    <h3 className="text-lg font-bold uppercase mt-4 border-2 border-black inline-block px-4 py-1 font-sans">Blotter Extract</h3>
                </div>
                <div className="w-24 h-24 flex items-center justify-center">
                    {settings?.logo_city_url ? (
                        <img src={settings.logo_city_url} alt="City Logo" className="w-full h-full object-contain" />
                    ) : (
                        <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center text-xs text-center text-gray-400">
                            City Logo
                        </div>
                    )}
                </div>
            </div>

            {/* Case Meta */}
            <div className="flex justify-between items-end mb-6 outline-none" contentEditable suppressContentEditableWarning>
                <div>
                    <p className="text-sm font-bold">Case Number:</p>
                    <p className="text-xl font-mono border-b border-black">{caseData.case_number}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold">Date & Time Reported:</p>
                    <p className="text-lg border-b border-black">{formattedDate}</p>
                </div>
            </div>

            {/* Main Content Table */}
            <div className="border-2 border-black outline-none" contentEditable suppressContentEditableWarning>
                {/* Row 1: Incident Type & Location */}
                <div className="flex border-b border-black">
                    <div className="w-1/2 p-2 border-r border-black">
                        <p className="text-xs font-bold uppercase text-gray-600">Nature of Incident</p>
                        <p className="font-semibold">{caseData.incident_type}</p>
                    </div>
                    <div className="w-1/2 p-2">
                        <p className="text-xs font-bold uppercase text-gray-600">Place of Incident</p>
                        <p className="font-semibold">{caseData.incident_location}</p>
                    </div>
                </div>

                {/* Row 2: Title */}
                <div className="p-2 border-b border-black">
                    <p className="text-xs font-bold uppercase text-gray-600">Subject / Title</p>
                    <p className="font-bold text-lg">{caseData.title}</p>
                </div>

                {/* Row 3: Parties */}
                <div className="flex border-b border-black">
                    <div className="w-1/2 p-2 border-r border-black">
                        <p className="text-xs font-bold uppercase text-gray-600 mb-1">Complainant(s)</p>
                        <ul className="list-disc list-inside text-sm">
                            {involvedParties.filter(p => p.type === 'Complainant').map(p => (
                                <li key={p.id}><span className="font-semibold">{p.name}</span> {p.contact_number && <span className="text-xs text-gray-500">({p.contact_number})</span>}</li>
                            ))}
                            {involvedParties.filter(p => p.type === 'Complainant').length === 0 && <li className="italic text-gray-500">None listed</li>}
                        </ul>
                    </div>
                    <div className="w-1/2 p-2">
                        <p className="text-xs font-bold uppercase text-gray-600 mb-1">Respondent(s)</p>
                        <ul className="list-disc list-inside text-sm">
                            {involvedParties.filter(p => p.type === 'Respondent').map(p => (
                                <li key={p.id}><span className="font-semibold">{p.name}</span></li>
                            ))}
                            {involvedParties.filter(p => p.type === 'Respondent').length === 0 && <li className="italic text-gray-500">None listed</li>}
                        </ul>
                    </div>
                </div>

                {/* Row 4: Narrative */}
                <div className="p-4 border-b border-black min-h-[150px]">
                    <p className="text-xs font-bold uppercase text-gray-600 mb-2">Narrative of Facts</p>
                    <p className="text-justify whitespace-pre-wrap leading-snug text-sm">
                        {caseData.narrative_facts || caseData.description}
                    </p>
                </div>

                {/* Row 5: Action Taken */}
                <div className="p-4 min-h-[100px]">
                    <p className="text-xs font-bold uppercase text-gray-600 mb-2">Action Taken / Disposition</p>
                    <p className="text-justify whitespace-pre-wrap leading-snug text-sm">
                        {caseData.narrative_action || 'No specific action recorded.'}
                    </p>
                </div>
            </div>

            {/* Status Footer */}
            <div className="mt-4 mb-12 outline-none" contentEditable suppressContentEditableWarning>
                <p className="text-sm">Current Status: <span className="font-bold uppercase">{caseData.status}</span></p>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-12 mt-12 outline-none" contentEditable suppressContentEditableWarning>
                <div className="text-center">
                    <div className="border-b border-black mb-2"></div>
                    <p className="text-xs font-bold uppercase">Signature of Complainant</p>
                </div>
                <div className="text-center">
                    <div className="border-b border-black mb-2"></div>
                    <p className="text-xs font-bold uppercase">Certified Correct By:</p>
                    <p className="text-sm font-semibold mt-4">{settings?.barangay_secretary || '[Name of Desk Officer]'}</p>
                    <p className="text-xs">Barangay Secretary / Desk Officer</p>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-16 text-center text-[10px] text-gray-500 border-t border-gray-300 pt-2">
                <p>This document is a system-generated extract from the Barangay Blotter System.</p>
                <p>Generated on: {generatedDate} | Case ID: {caseData.id}</p>
                <p>Not valid without the official Barangay Seal.</p>
            </div>
        </div>
    )
}
