'use client'

import { useActionState } from 'react'
import { createCase } from '../actions'

const initialState = {
    error: '',
}

export default function CreateCaseForm() {
    const [state, formAction, isPending] = useActionState(createCase, initialState)

    return (
        <form action={formAction} className="space-y-8">
            {state?.error && (
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                    <span className="font-medium">Error!</span> {state.error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label htmlFor="title" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Incident Title</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Give this report a short, descriptive name (e.g., "Theft at Barangay Hall").</p>
                    <input type="text" name="title" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="e.g., Theft at Barangay Hall" required />
                </div>

                <div>
                    <label htmlFor="incident_date" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Date & Time of Incident</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">When did the incident happen?</p>
                    <input type="datetime-local" name="incident_date" id="incident_date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
                </div>

                <div>
                    <label htmlFor="incident_location" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Location</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Where did the incident take place?</p>
                    <input type="text" name="incident_location" id="incident_location" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="e.g., Purok 3, Main Street" required />
                </div>

                <div className="md:col-span-2">
                    <label htmlFor="incident_type" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Incident Type</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">How would you categorize this incident?</p>
                    <select name="incident_type" id="incident_type" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
                        <option value="Theft">Theft</option>
                        <option value="Harassment">Harassment</option>
                        <option value="Vandalism">Vandalism</option>
                        <option value="Physical Injury">Physical Injury</option>
                        <option value="Property Damage">Property Damage</option>
                        <option value="Public Disturbance">Public Disturbance</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label htmlFor="narrative_facts" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Facts of the Case</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Describe the sequence of events in detail. Who, what, where, when, and how?</p>
                    <textarea name="narrative_facts" id="narrative_facts" rows={6} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Detail the sequence of events..." required></textarea>
                </div>

                <div className="md:col-span-2">
                    <label htmlFor="narrative_action" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Action Taken</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">What did the responding officer do? Was it resolved, referred, or is it under investigation?</p>
                    <textarea name="narrative_action" id="narrative_action" rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Describe the actions taken by the officer..." required></textarea>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t dark:border-gray-700">
                <a href="/dashboard" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700">
                    Cancel
                </a>
                <button
                    type="submit"
                    disabled={isPending}
                    className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 flex items-center gap-2 ${isPending ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                    {isPending ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating Report...
                        </>
                    ) : (
                        'Create Report'
                    )}
                </button>
            </div>
        </form>
    )
}
