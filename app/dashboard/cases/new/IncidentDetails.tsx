'use client'

export default function IncidentDetails() {
    const now = new Date().toISOString().slice(0, 16)

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white md:col-span-2 border-b pb-2 dark:border-gray-700">
                1. Incident Details
            </h2>

            <div className="md:col-span-2">
                <label htmlFor="title" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Incident Title</label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Give this report a short, descriptive name (e.g., "Theft at Barangay Hall").</p>
                <input type="text" name="title" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="e.g., Theft at Barangay Hall" required />
            </div>

            <div>
                <label htmlFor="incident_date" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Date & Time of Incident</label>
                <input
                    type="datetime-local"
                    name="incident_date"
                    id="incident_date"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    required
                    defaultValue={now}
                    max={now}
                />
                <p className="text-xs text-gray-500 mt-1">Date cannot be in the future.</p>
            </div>

            <div>
                <label htmlFor="incident_location" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Location</label>
                <input
                    type="text"
                    name="incident_location"
                    id="incident_location"
                    list="locations"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="e.g., Purok 3, Main Street"
                    required
                />
                <datalist id="locations">
                    <option value="Barangay Hall" />
                    <option value="Purok 1" />
                    <option value="Purok 2" />
                    <option value="Purok 3" />
                    <option value="Purok 4" />
                    <option value="Purok 5" />
                    <option value="Public Market" />
                    <option value="Covered Court" />
                    <option value="Elementary School" />
                </datalist>
            </div>

            <div className="md:col-span-2">
                <label htmlFor="incident_type" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Incident Type</label>
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
        </div>
    )
}
