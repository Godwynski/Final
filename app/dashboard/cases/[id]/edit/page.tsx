import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { updateCaseDetails } from '../actions'
import DeleteCaseButton from './DeleteCaseButton'
import Link from 'next/link'

export default async function EditCasePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const supabase = await createClient()
    const { id } = params

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect('/login')

    const { data: caseData, error } = await supabase
        .from('cases')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !caseData) return notFound()

    return (
        <div className="p-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Link
                            href={`/dashboard/cases/${id}`}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                            </svg>
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Case #{caseData.case_number}</h1>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 ml-8">
                        Update case information and details
                    </p>
                </div>
                <DeleteCaseButton caseId={id} />
            </div>

            {/* Form */}
            <form action={updateCaseDetails.bind(null, id)}>
                <div className="space-y-6">
                    {/* Basic Information Section */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Basic Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Incident Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    defaultValue={caseData.title}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="incident_date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Date & Time of Incident <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    name="incident_date"
                                    id="incident_date"
                                    defaultValue={new Date(caseData.incident_date).toISOString().slice(0, 16)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="incident_location" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Location <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="incident_location"
                                    id="incident_location"
                                    defaultValue={caseData.incident_location}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="e.g., Barangay Hall, Street Name"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="incident_type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Incident Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="incident_type"
                                    id="incident_type"
                                    defaultValue={caseData.incident_type || 'Other'}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                >
                                    <option value="Theft">Theft</option>
                                    <option value="Harassment">Harassment</option>
                                    <option value="Vandalism">Vandalism</option>
                                    <option value="Physical Injury">Physical Injury</option>
                                    <option value="Property Damage">Property Damage</option>
                                    <option value="Public Disturbance">Public Disturbance</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Narrative Section */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            Case Narrative
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label htmlFor="narrative_facts" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Facts of the Case <span className="text-red-500">*</span>
                                </label>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Describe what happened, when, where, and who was involved.</p>
                                <textarea
                                    name="narrative_facts"
                                    id="narrative_facts"
                                    rows={6}
                                    defaultValue={caseData.narrative_facts || caseData.description}
                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="Enter the detailed facts of the incident..."
                                    required
                                ></textarea>
                            </div>

                            <div>
                                <label htmlFor="narrative_action" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Action Taken <span className="text-red-500">*</span>
                                </label>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Document what actions have been taken or recommended.</p>
                                <textarea
                                    name="narrative_action"
                                    id="narrative_action"
                                    rows={4}
                                    defaultValue={caseData.narrative_action}
                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="Enter actions taken or recommendations..."
                                    required
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6">
                        <div className="flex justify-end gap-4">
                            <Link
                                href={`/dashboard/cases/${id}`}
                                className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700 inline-flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 inline-flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
