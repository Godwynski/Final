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

                <form action={createCase} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Incident Title</label>
                        <input type="text" name="title" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="e.g., Theft at Barangay Hall" required />
                    </div>

                    <div>
                        <label htmlFor="incident_date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date & Time of Incident</label>
                        <input type="datetime-local" name="incident_date" id="incident_date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
                    </div>

                    <div>
                        <label htmlFor="incident_location" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Location</label>
                        <input type="text" name="incident_location" id="incident_location" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="e.g., Purok 3, Main Street" required />
                    </div>

                    <div>
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Detailed Description</label>
                        <textarea name="description" id="description" rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Describe the incident details..." required></textarea>
                    </div>

                    <div className="flex justify-end gap-4">
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
