'use client'

import { useActionState, useState, useEffect } from 'react'
import { createCase } from '../actions'
import IncidentDetails from './IncidentDetails'
import PartyManager, { Party } from './PartyManager'
import NarrativeEditor from './NarrativeEditor'

const initialState = {
    error: '',
}

export default function CreateCaseForm() {
    const [state, formAction, isPending] = useActionState(createCase, initialState)
    const [parties, setParties] = useState<Party[]>([])

    // Auto-save parties to localStorage
    useEffect(() => {
        const savedParties = localStorage.getItem('draft_case_parties')
        if (savedParties) {
            try {
                setParties(JSON.parse(savedParties))
            } catch (e) {
                console.error('Error parsing saved draft:', e)
            }
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('draft_case_parties', JSON.stringify(parties))
    }, [parties])

    return (
        <form action={(formData) => {
            // Clear draft before submitting
            localStorage.removeItem('draft_case_parties')
            formAction(formData)
        }} className="space-y-8">
            {state?.error && (
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                    <span className="font-medium">Error!</span> {state.error}
                </div>
            )}

            {/* Hidden input to pass parties data to server action */}
            <input type="hidden" name="involved_parties" value={JSON.stringify(parties)} />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <IncidentDetails />
                </div>
                <div className="space-y-6">
                    <PartyManager parties={parties} setParties={setParties} />
                </div>
            </div>

            <NarrativeEditor />

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
