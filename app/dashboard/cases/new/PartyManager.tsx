'use client'

import { useState } from 'react'
import { searchParties } from '../actions'
import { useDebouncedCallback } from 'use-debounce'

export type Party = {
    id: string
    name: string
    type: 'Complainant' | 'Respondent' | 'Witness'
    contact_number: string
    email: string
    address: string
}

export default function PartyManager({ parties, setParties }: { parties: Party[], setParties: (parties: Party[]) => void }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newParty, setNewParty] = useState<Partial<Party>>({
        type: 'Complainant',
        name: '',
        contact_number: '',
        email: '',
        address: ''
    })
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [showResults, setShowResults] = useState(false)

    const handleSearch = useDebouncedCallback(async (term: string) => {
        if (term.length < 2) {
            setSearchResults([])
            setShowResults(false)
            return
        }
        const results = await searchParties(term)
        setSearchResults(results)
        setShowResults(true)
    }, 300)

    const selectResult = (result: any) => {
        setNewParty({
            ...newParty,
            name: result.name,
            contact_number: result.contact_number || '',
            email: result.email || '',
            address: result.address || ''
        })
        setShowResults(false)
    }

    const handleAddParty = () => {
        if (!newParty.name || !newParty.type) return

        const party: Party = {
            id: crypto.randomUUID(),
            name: newParty.name,
            type: newParty.type as any,
            contact_number: newParty.contact_number || '',
            email: newParty.email || '',
            address: newParty.address || ''
        }

        setParties([...parties, party])
        setNewParty({ type: 'Complainant', name: '', contact_number: '', email: '', address: '' })
        setIsModalOpen(false)
        setSearchResults([])
    }

    const removeParty = (id: string) => {
        setParties(parties.filter(p => p.id !== id))
    }

    return (
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="flex justify-between items-center border-b pb-2 mb-4 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    2. Involved Parties
                </h2>
                <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                    + Add Person
                </button>
            </div>

            {parties.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">No parties added yet. Please add at least one complainant.</p>
            ) : (
                <div className="space-y-3">
                    {parties.map((party) => (
                        <div key={party.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {party.name}
                                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${party.type === 'Complainant' ? 'bg-blue-100 text-blue-800' :
                                            party.type === 'Respondent' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {party.type}
                                    </span>
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {party.contact_number} {party.email ? `• ${party.email}` : ''}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeParty(party.id)}
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 dark:bg-gray-800">
                        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Add Involved Party</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 dark:text-white">Type</label>
                                <select
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    value={newParty.type}
                                    onChange={(e) => setNewParty({ ...newParty, type: e.target.value as any })}
                                >
                                    <option value="Complainant">Complainant</option>
                                    <option value="Respondent">Respondent</option>
                                    <option value="Witness">Witness</option>
                                </select>
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                <input
                                    type="text"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Search or enter name..."
                                    value={newParty.name}
                                    onChange={(e) => {
                                        setNewParty({ ...newParty, name: e.target.value })
                                        handleSearch(e.target.value)
                                    }}
                                    onFocus={() => {
                                        if (newParty.name && newParty.name.length >= 2) handleSearch(newParty.name)
                                    }}
                                />
                                {showResults && searchResults.length > 0 && (
                                    <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 dark:bg-gray-700 dark:border-gray-600 max-h-48 overflow-y-auto">
                                        {searchResults.map((result, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
                                                onClick={() => selectResult(result)}
                                            >
                                                <p className="font-medium">{result.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{result.address}</p>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-900 dark:text-white">Contact Number</label>
                                <input
                                    type="text"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Mobile / Landline"
                                    value={newParty.contact_number}
                                    onChange={(e) => setNewParty({ ...newParty, contact_number: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-900 dark:text-white">Address</label>
                                <input
                                    type="text"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Current Address"
                                    value={newParty.address}
                                    onChange={(e) => setNewParty({ ...newParty, address: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleAddParty}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 dark:bg-blue-600"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
