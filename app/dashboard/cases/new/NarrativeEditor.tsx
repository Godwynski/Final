'use client'

import { useState, useRef, useEffect } from 'react'

const TEMPLATES = {
    'Theft': 'Items stolen:\n- \n\nEstimated Value:\n\nPoint of Entry:\n\nSuspect Description:',
    'Physical Injury': 'Weapon used (if any):\n\nInjuries sustained:\n\nMedical attention given:',
    'Vandalism': 'Property damaged:\n\nEstimated cost of repair:\n\nDescription of damage:',
    'Default': 'Who:\nWhat:\nWhere:\nWhen:\nWhy/How:'
}

export default function NarrativeEditor() {
    const [facts, setFacts] = useState('')

    const applyTemplate = (type: keyof typeof TEMPLATES) => {
        if (confirm('This will replace the current text. Continue?')) {
            setFacts(TEMPLATES[type] || TEMPLATES['Default'])
        }
    }

    return (
        <div className="grid grid-cols-1 gap-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="flex justify-between items-center border-b pb-2 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    3. Narrative & Action
                </h2>
                <div className="flex gap-2">
                    <button type="button" onClick={() => applyTemplate('Default')} className="text-xs text-blue-600 hover:underline">Reset Template</button>
                    <button type="button" onClick={() => applyTemplate('Theft')} className="text-xs text-blue-600 hover:underline">Theft Template</button>
                    <button type="button" onClick={() => applyTemplate('Physical Injury')} className="text-xs text-blue-600 hover:underline">Injury Template</button>
                </div>
            </div>

            <div>
                <label htmlFor="narrative_facts" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Facts of the Case</label>
                <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Describe the sequence of events in detail.</p>
                </div>
                <textarea
                    name="narrative_facts"
                    id="narrative_facts"
                    rows={8}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Detail the sequence of events..."
                    required
                    value={facts}
                    onChange={(e) => setFacts(e.target.value)}
                ></textarea>
            </div>

            <div>
                <label htmlFor="narrative_action" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Action Taken</label>
                <textarea name="narrative_action" id="narrative_action" rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Describe the actions taken by the officer..." required></textarea>
            </div>
        </div>
    )
}
