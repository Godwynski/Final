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
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 h-full flex flex-col">
            <div className="flex justify-between items-center border-b pb-4 mb-6 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    2. Involved Parties
                </h2>
                <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Person
                </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-[200px]">
                {parties.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                        <svg className="w-12 h-12 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <p className="text-sm font-medium">No parties added yet</p>
                        <p className="text-xs">Add at least one complainant to proceed.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {parties.map((party) => (
                            <div key={party.id} className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group">
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 ${party.type === 'Complainant' ? 'bg-blue-500' :
                                    party.type === 'Respondent' ? 'bg-red-500' :
                                        'bg-gray-500'
                                    }`}>
                                    {party.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                        {party.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {party.type}
                                    </p>
                                    {(party.contact_number || party.email) && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                                            {party.contact_number} {party.email ? `• ${party.email}` : ''}
                                        </p>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeParty(party.id)}
                                    className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                                    title="Remove"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transform transition-all scale-100">
                        <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add Involved Party</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Complainant', 'Respondent', 'Witness'].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setNewParty({ ...newParty, type: type as any })}
                                            className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${newParty.type === type
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                                </div>
                                {showResults && searchResults.length > 0 && (
                                    <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 dark:bg-gray-700 dark:border-gray-600 max-h-48 overflow-y-auto">
                                        {searchResults.map((result, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-600 border-b last:border-0 dark:border-gray-600 transition-colors"
                                                onClick={() => selectResult(result)}
                                            >
                                                <p className="font-bold text-gray-900 dark:text-white">{result.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{result.address}</p>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contact</label>
                                    <input
                                        type="text"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="Mobile / Landline"
                                        value={newParty.contact_number}
                                        onChange={(e) => setNewParty({ ...newParty, contact_number: e.target.value })}
                                        onInput={(e) => {
                                            const target = e.target as HTMLInputElement;
                                            target.value = target.value.replace(/[^0-9]/g, '');
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                                    <input
                                        type="text"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="Current Address"
                                        value={newParty.address}
                                        onChange={(e) => setNewParty({ ...newParty, address: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleAddParty}
                                disabled={!newParty.name}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add Party
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
