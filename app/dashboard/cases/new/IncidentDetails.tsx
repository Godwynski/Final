'use client'

export default function IncidentDetails() {
    const now = new Date().toISOString().slice(0, 16)

    return (
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b pb-4 mb-6 dark:border-gray-700 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                1. Incident Details
            </h2>

            <div className="space-y-6">
                <div>
                    <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Incident Title</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <input type="text" name="title" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="e.g., Theft at Barangay Hall" required />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Give this report a short, descriptive name.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="incident_date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date & Time</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <input
                                type="datetime-local"
                                name="incident_date"
                                id="incident_date"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                required
                                defaultValue={now}
                                max={now}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="incident_type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Incident Type</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                            <select name="incident_type" id="incident_type" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
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
                </div>

                <div>
                    <label htmlFor="incident_location" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Location</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            name="incident_location"
                            id="incident_location"
                            list="locations"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
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
                </div>
            </div>
        </div>
    )
}
