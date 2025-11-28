import { createCase } from '../actions'

export default async function NewCasePage(props: { searchParams: Promise<{ error?: string }> }) {
    const searchParams = await props.searchParams
    return (
        <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow dark:bg-gray-800 p-8">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Create New Blotter Report</h1>

                {searchParams.error && (
                    <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                        <span className="font-medium">Error!</span> {searchParams.error}
                    </div>
                )}

                <form action={createCase} className="space-y-8">
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
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                            Create Report
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
