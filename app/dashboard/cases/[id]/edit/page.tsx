import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { updateCaseDetails } from '../actions'
import DeleteCaseButton from './DeleteCaseButton'

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
        <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Case #{caseData.case_number}</h1>
                    <DeleteCaseButton caseId={id} />
                </div>

                <form action={updateCaseDetails.bind(null, id)} className="space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label htmlFor="title" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Incident Title</label>
                            <input type="text" name="title" id="title" defaultValue={caseData.title} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
                        </div>

                        <div>
                            <label htmlFor="incident_date" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Date & Time of Incident</label>
                            <input type="datetime-local" name="incident_date" id="incident_date" defaultValue={new Date(caseData.incident_date).toISOString().slice(0, 16)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
                        </div>

                        <div>
                            <label htmlFor="incident_location" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Location</label>
                            <input type="text" name="incident_location" id="incident_location" defaultValue={caseData.incident_location} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="incident_type" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Incident Type</label>
                            <select name="incident_type" id="incident_type" defaultValue={caseData.incident_type || 'Other'} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
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
                            <textarea name="narrative_facts" id="narrative_facts" rows={6} defaultValue={caseData.narrative_facts || caseData.description} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required></textarea>
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="narrative_action" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Action Taken</label>
                            <textarea name="narrative_action" id="narrative_action" rows={4} defaultValue={caseData.narrative_action} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required></textarea>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t dark:border-gray-700">
                        <a href={`/dashboard/cases/${id}`} className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700">
                            Cancel
                        </a>
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
