'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import CopyButton from '@/components/CopyButton'
import StatusStepper from '@/components/StatusStepper'
import SubmitButton from '@/components/SubmitButton'
import { updateCaseStatus, addInvolvedParty, addCaseNote, deleteCaseNote, generateCaseGuestLink, toggleGuestLinkStatus, emailGuestLink, updateActionTaken } from './actions'
import DashboardEvidenceList from '@/components/DashboardEvidenceList'
import DashboardEvidenceUploadForm from '@/components/DashboardEvidenceUploadForm'

type Tab = 'overview' | 'parties' | 'evidence' | 'notes' | 'activity'

export default function CaseDetailsClient({
    caseData,
    involvedParties,
    evidence,
    notes,
    auditLogs,
    guestLinks,
    userRole,
    userId
}: {
    caseData: any,
    involvedParties: any[],
    evidence: any[],
    notes: any[],
    auditLogs: any[],
    guestLinks: any[],
    userRole: string,
    userId: string
}) {
    const searchParams = useSearchParams()
    const initialTab = (searchParams.get('tab') as Tab) || 'overview'
    const [activeTab, setActiveTab] = useState<Tab>(initialTab)
    const [formattedDate, setFormattedDate] = useState<string>('')
    const [origin, setOrigin] = useState<string>('')

    const [generatedDate, setGeneratedDate] = useState<string>('')

    // Format date on client only to avoid hydration mismatch
    useEffect(() => {
        setFormattedDate(new Date(caseData.incident_date).toLocaleString())
        setOrigin(window.location.origin)
        setGeneratedDate(new Date().toLocaleString())
    }, [caseData.incident_date])

    return (
        <div className="p-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Case #{caseData.case_number}: {caseData.title}</h1>
                        {caseData.incident_type && (
                            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300">
                                {caseData.incident_type}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Reported on {formattedDate || new Date(caseData.incident_date).toISOString().slice(0, 10)} • {caseData.incident_location}
                    </p>
                </div>
                <div className="flex gap-2 print:hidden">
                    <button
                        onClick={() => window.print()}
                        className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700"
                    >
                        🖨️ Print Abstract
                    </button>
                    <Link href={`/dashboard/cases/${caseData.id}/edit`} className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700">
                        Edit Case
                    </Link>
                </div>
            </div>

            {/* Printable Abstract (Visible only on print) */}
            <div className="hidden print:block bg-white text-black p-8 max-w-[210mm] mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 border-b-2 border-black pb-4">
                    <div className="w-24 h-24 flex items-center justify-center border border-gray-300 rounded-full">
                        <span className="text-xs text-center text-gray-500">Barangay Logo</span>
                    </div>
                    <div className="text-center flex-1">
                        <h1 className="text-xl font-bold uppercase tracking-wide">Republic of the Philippines</h1>
                        <p className="text-sm uppercase">Province of [Province Name]</p>
                        <p className="text-sm uppercase">City/Municipality of [City Name]</p>
                        <h2 className="text-2xl font-black uppercase mt-2">Barangay [Barangay Name]</h2>
                        <h3 className="text-lg font-bold uppercase mt-4 border-2 border-black inline-block px-4 py-1">Blotter Extract</h3>
                    </div>
                    <div className="w-24 h-24 flex items-center justify-center border border-gray-300 rounded-full">
                        <span className="text-xs text-center text-gray-500">City/Muni Logo</span>
                    </div>
                </div>

                {/* Case Meta */}
                <div className="flex justify-between items-end mb-6">
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
                <div className="border-2 border-black">
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
                <div className="mt-4 mb-12">
                    <p className="text-sm">Current Status: <span className="font-bold uppercase">{caseData.status}</span></p>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-12 mt-12">
                    <div className="text-center">
                        <div className="border-b border-black mb-2"></div>
                        <p className="text-xs font-bold uppercase">Signature of Complainant</p>
                    </div>
                    <div className="text-center">
                        <div className="border-b border-black mb-2"></div>
                        <p className="text-xs font-bold uppercase">Certified Correct By:</p>
                        <p className="text-sm font-semibold mt-4">[Name of Desk Officer]</p>
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

            {/* Screen Content (Hidden on print) */}
            <div className="print:hidden">

                {/* Status Stepper */}
                <div className="mb-8 p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <StatusStepper status={caseData.status} />
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                    <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                        <li className="me-2">
                            <button onClick={() => setActiveTab('overview')} className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'overview' ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}>
                                Overview
                            </button>
                        </li>
                        <li className="me-2">
                            <button onClick={() => setActiveTab('parties')} className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'parties' ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}>
                                Involved Parties
                            </button>
                        </li>
                        <li className="me-2">
                            <button onClick={() => setActiveTab('evidence')} className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'evidence' ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}>
                                Evidence & Links
                            </button>
                        </li>
                        <li className="me-2">
                            <button onClick={() => setActiveTab('notes')} className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'notes' ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}>
                                Notes & Timeline
                            </button>
                        </li>
                        <li className="me-2">
                            <button onClick={() => setActiveTab('activity')} className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'activity' ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}>
                                Activity Log
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Tab Content */}
                <div>
                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column: Facts & Context */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6 space-y-6">
                                    <div>
                                        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Facts of the Case</h2>
                                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{caseData.narrative_facts || caseData.description}</p>
                                    </div>
                                </div>

                                {/* Quick Summary of Parties */}
                                <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Involved Parties</h3>
                                        <button onClick={() => setActiveTab('parties')} className="text-sm text-blue-600 hover:underline dark:text-blue-500">View All</button>
                                    </div>
                                    {involvedParties.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {involvedParties.map(p => (
                                                <span key={p.id} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                                                    {p.name} ({p.type})
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic text-sm dark:text-gray-400">No parties listed.</p>
                                    )}
                                </div>
                            </div>

                            {/* Right Column: Action & Status (The "Last Right") */}
                            <div className="space-y-6">
                                {/* Action Taken - Editable */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800">
                                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                                        Action Taken
                                    </h2>

                                    {/* Quick Actions */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <button
                                            onClick={() => {
                                                const textarea = document.querySelector('textarea[name="narrative_action"]') as HTMLTextAreaElement
                                                if (textarea) {
                                                    const timestamp = new Date().toLocaleString()
                                                    const template = `\n[${timestamp}] Hearing scheduled for [Date/Time]. Parties notified.`
                                                    textarea.value += (textarea.value ? '\n' : '') + template
                                                    textarea.focus()
                                                }
                                            }}
                                            className="text-xs bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 px-2 py-1 rounded shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-blue-400 dark:hover:bg-gray-700"
                                        >
                                            📅 Schedule Hearing
                                        </button>
                                        <button
                                            onClick={() => {
                                                const textarea = document.querySelector('textarea[name="narrative_action"]') as HTMLTextAreaElement
                                                if (textarea) {
                                                    const timestamp = new Date().toLocaleString()
                                                    const template = `\n[${timestamp}] Amicable settlement reached. Agreement signed by both parties.`
                                                    textarea.value += (textarea.value ? '\n' : '') + template
                                                    textarea.focus()
                                                }
                                            }}
                                            className="text-xs bg-white border border-green-200 text-green-700 hover:bg-green-50 px-2 py-1 rounded shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-green-400 dark:hover:bg-gray-700"
                                        >
                                            🤝 Record Settlement
                                        </button>
                                        <button
                                            onClick={() => {
                                                const textarea = document.querySelector('textarea[name="narrative_action"]') as HTMLTextAreaElement
                                                if (textarea) {
                                                    const timestamp = new Date().toLocaleString()
                                                    const template = `\n[${timestamp}] Mediation failed. Certification to File Action (CFA) issued.`
                                                    textarea.value += (textarea.value ? '\n' : '') + template
                                                    textarea.focus()
                                                }
                                            }}
                                            className="text-xs bg-white border border-red-200 text-red-700 hover:bg-red-50 px-2 py-1 rounded shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-red-400 dark:hover:bg-gray-700"
                                        >
                                            ⚖️ Issue CFA
                                        </button>
                                    </div>

                                    <form action={updateActionTaken.bind(null, caseData.id)}>
                                        <textarea
                                            name="narrative_action"
                                            rows={6}
                                            defaultValue={caseData.narrative_action}
                                            className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-3"
                                            placeholder="Describe the actions taken to resolve this case..."
                                        ></textarea>
                                        <SubmitButton className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" loadingText="Updating...">
                                            Update Action
                                        </SubmitButton>
                                    </form>
                                </div>

                                {/* Status Update */}
                                <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6">
                                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Update Status</h3>
                                    <form action={updateCaseStatus.bind(null, caseData.id)} className="flex flex-col gap-3">
                                        <select name="status" defaultValue={caseData.status} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
                                            <option value="New">New</option>
                                            <option value="Under Investigation">Under Investigation</option>
                                            <option value="Settled">Settled</option>
                                            <option value="Closed">Closed</option>
                                        </select>
                                        <SubmitButton className="w-full text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700" loadingText="Changing...">
                                            Change Status
                                        </SubmitButton>
                                    </form>
                                </div>

                                {/* Case Info Metadata */}
                                <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6">
                                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Case Info</h3>
                                    <dl className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <dt className="text-gray-500 dark:text-gray-400">Reported By:</dt>
                                            <dd className="font-medium text-gray-900 dark:text-white">{caseData.reported_by?.full_name || caseData.reported_by?.email || 'Unknown'}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-gray-500 dark:text-gray-400">Created At:</dt>
                                            <dd className="font-medium text-gray-900 dark:text-white" suppressHydrationWarning>{new Date(caseData.created_at).toLocaleDateString()}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-gray-500 dark:text-gray-400">Last Updated:</dt>
                                            <dd className="font-medium text-gray-900 dark:text-white" suppressHydrationWarning>{new Date(caseData.updated_at).toLocaleDateString()}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PARTIES TAB */}
                    {
                        activeTab === 'parties' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6">
                                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Involved Parties</h2>
                                        {involvedParties.length === 0 ? (
                                            <p className="text-gray-500 italic dark:text-gray-400">No parties added yet.</p>
                                        ) : (
                                            <ul className="space-y-4">
                                                {involvedParties.map(party => (
                                                    <li key={party.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <p className="font-medium text-gray-900 dark:text-white">{party.name}</p>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">{party.type}</p>
                                                                {party.contact_number && <p className="text-sm text-gray-500 dark:text-gray-400">📞 {party.contact_number}</p>}
                                                                {party.email && <p className="text-sm text-gray-500 dark:text-gray-400">✉️ {party.email}</p>}
                                                                {party.address && <p className="text-sm text-gray-500 dark:text-gray-400">🏠 {party.address}</p>}
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6">
                                        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Add Party</h3>
                                        <form action={addInvolvedParty.bind(null, caseData.id)} className="space-y-4">
                                            <div>
                                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                                <input type="text" name="name" id="name" required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                            </div>
                                            <div>
                                                <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Type</label>
                                                <select name="type" id="type" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                                    <option value="Complainant">Complainant</option>
                                                    <option value="Respondent">Respondent</option>
                                                    <option value="Witness">Witness</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="contact" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contact #</label>
                                                <input type="text" name="contact" id="contact" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                                <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                            </div>
                                            <div>
                                                <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                                                <input type="text" name="address" id="address" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                            </div>
                                            <SubmitButton className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" loadingText="Adding Party...">
                                                Add Party
                                            </SubmitButton>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {/* EVIDENCE TAB */}
                    {
                        activeTab === 'evidence' && (
                            <div className="space-y-6">
                                <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6">
                                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Evidence</h2>
                                    <DashboardEvidenceList evidence={evidence} caseId={caseData.id} />

                                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Upload New Evidence</h3>
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                                            <DashboardEvidenceUploadForm caseId={caseData.id} />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Guest Upload Links</h2>
                                        <form action={generateCaseGuestLink.bind(null, caseData.id)}>
                                            <SubmitButton className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-800" loadingText="Generating...">
                                                Generate New Link
                                            </SubmitButton>
                                        </form>
                                    </div>

                                    <div className="space-y-4">
                                        {guestLinks.map(link => (
                                            <div key={link.id} className="mb-4">
                                                <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-lg gap-2 border ${link.is_active ? 'bg-blue-50 border-blue-100 dark:bg-blue-900/30 dark:border-blue-800' : 'bg-gray-100 border-gray-200 dark:bg-gray-700 dark:border-gray-600 opacity-75'}`}>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-mono text-blue-600 dark:text-blue-400">Link: ...{link.token.slice(-8)}</span>
                                                            <CopyButton text={`/guest/${link.token}`} label="Copy Link" />
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">PIN: {link.pin}</span>
                                                            <CopyButton text={link.pin} label="Copy PIN" />
                                                        </div>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">Expires: <span suppressHydrationWarning>{new Date(link.expires_at).toLocaleString()}</span></span>
                                                        {!link.is_active && <span className="text-xs text-red-500 font-bold">INACTIVE</span>}
                                                    </div>
                                                    <div className="flex gap-3 items-center">
                                                        {link.is_active && (
                                                            <a href={`/guest/${link.token}`} target="_blank" className="text-sm text-blue-600 hover:underline dark:text-blue-400">Open</a>
                                                        )}
                                                        <form action={toggleGuestLinkStatus.bind(null, link.id, link.is_active, caseData.id)}>
                                                            <SubmitButton className={`text-xs hover:underline ${link.is_active ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`} loadingText="...">
                                                                {link.is_active ? 'Close Link' : 'Re-open Link'}
                                                            </SubmitButton>
                                                        </form>
                                                    </div>
                                                </div>
                                                {link.is_active && (
                                                    <form action={emailGuestLink} className="mt-2 flex gap-2 items-center pl-2">
                                                        <input type="hidden" name="link" value={`${origin}/guest/${link.token}`} />
                                                        <input type="hidden" name="pin" value={link.pin} />
                                                        <input type="hidden" name="caseId" value={caseData.id} />
                                                        <input type="email" name="email" placeholder="Recipient Email" required className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-48 p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                                        <SubmitButton className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-xs px-3 py-1.5 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800" loadingText="Sending...">
                                                            Email
                                                        </SubmitButton>
                                                    </form>
                                                )}
                                            </div>
                                        ))}
                                        {guestLinks.length === 0 && <p className="text-sm text-gray-500 italic dark:text-gray-400">No links generated yet.</p>}
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {/* NOTES TAB */}
                    {
                        activeTab === 'notes' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6">
                                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Case Notes & Timeline</h2>
                                        <div className="space-y-6">
                                            {notes.map(note => (
                                                <div key={note.id} className="border-l-4 border-blue-500 pl-4 py-1 group relative">
                                                    <div className="flex justify-between items-start">
                                                        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap flex-1">{note.content}</p>
                                                        <button
                                                            onClick={async () => {
                                                                if (confirm('Are you sure you want to delete this note?')) {
                                                                    const result = await deleteCaseNote(caseData.id, note.id)
                                                                    if (result?.error) alert(result.error)
                                                                }
                                                            }}
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 ml-2"
                                                            title="Delete Note"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                        </button>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                                                        By {note.profiles?.full_name || note.profiles?.email || 'Unknown'} on <span suppressHydrationWarning>{new Date(note.created_at).toLocaleString()}</span>
                                                    </p>
                                                </div>
                                            ))}
                                            {notes.length === 0 && <p className="text-gray-500 italic dark:text-gray-400">No notes added yet.</p>}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6">
                                        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Add Note</h3>
                                        <form
                                            action={async (formData) => {
                                                const result = await addCaseNote(caseData.id, formData)
                                                if (result?.error) {
                                                    alert(result.error)
                                                } else {
                                                    // Reset the textarea
                                                    const form = document.getElementById('add-note-form') as HTMLFormElement
                                                    if (form) form.reset()
                                                }
                                            }}
                                            id="add-note-form"
                                            className="space-y-4"
                                        >
                                            <div>
                                                <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Note Content</label>
                                                <textarea name="content" id="content" rows={4} required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
                                            </div>
                                            <SubmitButton className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" loadingText="Adding Note...">
                                                Add Note
                                            </SubmitButton>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {/* ACTIVITY TAB */}
                    {
                        activeTab === 'activity' && (
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6">
                                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Activity Log</h2>
                                <div className="relative border-l border-gray-200 dark:border-gray-700 ml-3">
                                    {auditLogs.length === 0 ? (
                                        <p className="text-gray-500 italic ml-4 dark:text-gray-400">No activity recorded yet.</p>
                                    ) : (
                                        auditLogs.map((log) => (
                                            <div key={log.id} className="mb-10 ml-6">
                                                <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                                    <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                                    </svg>
                                                </span>
                                                <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                                                    {log.action}
                                                    <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ml-3" suppressHydrationWarning>
                                                        {new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString()}
                                                    </span>
                                                </h3>
                                                <div className="mb-2 text-base font-normal text-gray-500 dark:text-gray-400">
                                                    <span className="font-medium text-gray-900 dark:text-white">{log.profiles?.full_name || log.profiles?.email || 'System'}</span> performed this action.
                                                </div>
                                                {log.details && (
                                                    <div className="p-3 text-sm text-gray-600 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                                                        {log.details.narrative_action && (
                                                            <div>
                                                                <span className="font-semibold text-gray-900 dark:text-white">Action Taken:</span>
                                                                <p className="mt-1 whitespace-pre-wrap">{log.details.narrative_action}</p>
                                                            </div>
                                                        )}
                                                        {log.details.old_status && log.details.new_status && (
                                                            <div>
                                                                <span className="font-semibold text-gray-900 dark:text-white">Status Change:</span>
                                                                <p className="mt-1">
                                                                    Changed from <span className="font-medium text-gray-800 dark:text-gray-200">{log.details.old_status}</span> to <span className="font-medium text-blue-600 dark:text-blue-400">{log.details.new_status}</span>
                                                                </p>
                                                            </div>
                                                        )}
                                                        {!log.details.narrative_action && (!log.details.old_status || !log.details.new_status) && (
                                                            <pre className="whitespace-pre-wrap font-sans text-xs">{JSON.stringify(log.details, null, 2)}</pre>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
