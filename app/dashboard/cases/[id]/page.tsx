import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { updateCaseStatus, addInvolvedParty, addCaseNote, generateCaseGuestLink, toggleGuestLinkStatus } from './actions'

export default async function CaseDetailsPage(props: { params: Promise<{ id: string }>, searchParams: Promise<{ message?: string, error?: string }> }) {
    const params = await props.params
    const searchParams = await props.searchParams
    const supabase = await createClient()
    const { id } = params

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect('/login')

    // Fetch all case data in parallel
    const [caseRes, partiesRes, notesRes, evidenceRes, linksRes] = await Promise.all([
        supabase.from('cases').select('*').eq('id', id).single(),
        supabase.from('involved_parties').select('*').eq('case_id', id),
        supabase.from('case_notes').select('*, profiles:created_by(email)').eq('case_id', id).order('created_at', { ascending: false }),
        supabase.from('evidence').select('*').eq('case_id', id),
        supabase.from('guest_links').select('*').eq('case_id', id).order('created_at', { ascending: false })
    ])

    if (caseRes.error || !caseRes.data) return notFound()

    const caseData = caseRes.data
    const parties = partiesRes.data || []
    const notes = notesRes.data || []
    const evidence = evidenceRes.data || []
    const allLinks = linksRes.data || []
    const activeLinks = allLinks.filter(l => l.is_active)

    return (
        <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <a href="/dashboard" className="flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Back to Cases
                    </a>
                </div>

                {searchParams.message && (
                    <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
                        <span className="font-medium">Success!</span> {searchParams.message}
                    </div>
                )}

                {searchParams.error && (
                    <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                        <span className="font-medium">Error!</span> {searchParams.error}
                    </div>
                )}

                {/* Header Section */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Case #{caseData.case_number}: {caseData.title}</h1>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${caseData.status === 'New' ? 'bg-blue-100 text-blue-800' :
                                caseData.status === 'Settled' ? 'bg-green-100 text-green-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                {caseData.status}
                            </span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">
                            Reported on {new Date(caseData.incident_date).toLocaleString()} • {caseData.incident_location}
                        </p>
                    </div>
                    <form action={updateCaseStatus.bind(null, id)} className="flex gap-2">
                        <select name="status" defaultValue={caseData.status} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
                            <option value="New">New</option>
                            <option value="Under Investigation">Under Investigation</option>
                            <option value="Settled">Settled</option>
                            <option value="Closed">Closed</option>
                        </select>
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                            Update
                        </button>
                    </form>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column: Details & Parties */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Description</h2>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{caseData.description}</p>
                        </div>

                        {/* Involved Parties */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Involved Parties</h2>
                            <div className="space-y-4 mb-6">
                                {parties.map(party => (
                                    <div key={party.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg dark:border-gray-700">
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{party.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{party.type}</p>
                                        </div>
                                        <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                                            <p>{party.contact_number}</p>
                                            <p>{party.email}</p>
                                            <p>{party.address}</p>
                                        </div>
                                    </div>
                                ))}
                                {parties.length === 0 && <p className="text-gray-500 italic">No parties added yet.</p>}
                            </div>

                            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Add Party</h3>
                            <form action={addInvolvedParty.bind(null, id)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" name="name" placeholder="Name" required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                <select name="type" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    <option value="Complainant">Complainant</option>
                                    <option value="Respondent">Respondent</option>
                                    <option value="Witness">Witness</option>
                                </select>
                                <input type="text" name="contact_number" placeholder="Contact Number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                <input type="email" name="email" placeholder="Email Address" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                <input type="text" name="address" placeholder="Address" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white md:col-span-2" />
                                <button type="submit" className="md:col-span-2 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Add Person</button>
                            </form>
                        </div>

                        {/* Evidence & Guest Links */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Evidence & Guest Access</h2>

                            <div className="mb-6">
                                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Uploaded Files</h3>
                                {evidence.length === 0 ? (
                                    <p className="text-gray-500 italic mb-4">No evidence uploaded.</p>
                                ) : (
                                    <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                                        {evidence.map(e => (
                                            <li key={e.id}>{e.file_name} ({e.file_type})</li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="border-t pt-4 dark:border-gray-700">
                                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Generate Secure Upload Link</h3>
                                <p className="text-sm text-gray-500 mb-4">Create a link for involved parties to upload evidence directly.</p>

                                <div className="space-y-2 mb-4">
                                    {allLinks.map(link => (
                                        <div key={link.id} className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded gap-2 ${link.is_active ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-700 opacity-75'}`}>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-mono text-blue-600 dark:text-blue-400">Token: ...{link.token.slice(-8)}</span>
                                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">PIN: {link.pin}</span>
                                                <span className="text-xs text-gray-500">Expires: {new Date(link.expires_at).toLocaleString()}</span>
                                                {!link.is_active && <span className="text-xs text-red-500 font-bold">INACTIVE</span>}
                                            </div>
                                            <div className="flex gap-3 items-center">
                                                {link.is_active && (
                                                    <a href={`/guest/${link.token}`} target="_blank" className="text-sm text-blue-600 hover:underline dark:text-blue-400">Open</a>
                                                )}
                                                <form action={toggleGuestLinkStatus.bind(null, link.id, link.is_active, id)}>
                                                    <button type="submit" className={`text-xs hover:underline ${link.is_active ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                                        {link.is_active ? 'Close Link' : 'Re-open Link'}
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    ))}
                                    {allLinks.length === 0 && <p className="text-sm text-gray-500 italic">No links generated yet.</p>}
                                </div>

                                <form action={generateCaseGuestLink.bind(null, id)} className="flex gap-2">
                                    <select name="duration" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                        <option value="24">24 Hours</option>
                                        <option value="48">48 Hours</option>
                                        <option value="1">1 Hour</option>
                                    </select>
                                    <button type="submit" className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">Generate Link</button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Notes */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow h-full flex flex-col">
                            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Case Notes</h2>

                            <div className="flex-1 overflow-y-auto max-h-[500px] space-y-4 mb-4 pr-2">
                                {notes.map(note => (
                                    <div key={note.id} className="bg-gray-50 p-3 rounded-lg dark:bg-gray-700">
                                        <p className="text-gray-800 dark:text-gray-200 text-sm mb-1">{note.content}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {new Date(note.created_at).toLocaleString()} by {note.profiles?.email || 'Unknown'}
                                        </p>
                                    </div>
                                ))}
                                {notes.length === 0 && <p className="text-gray-500 italic text-center py-4">No notes yet.</p>}
                            </div>

                            <form action={addCaseNote.bind(null, id)} className="mt-auto">
                                <textarea name="content" rows={3} placeholder="Add a follow-up note..." required className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white mb-2"></textarea>
                                <button type="submit" className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Add Note</button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
