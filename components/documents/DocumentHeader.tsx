import React from 'react'


interface DocumentHeaderProps {
    settings: any
}

export default function DocumentHeader({ settings }: DocumentHeaderProps) {
    const barangayName = settings?.barangay_name || '[Barangay Name]'
    const city = settings?.city_municipality || '[City/Municipality]'
    const province = settings?.province || '[Province]'

    return (
        <div className="text-center mb-8 relative">
            {/* Left Logo (Barangay) */}
            <div className="absolute left-0 top-0 w-24 h-24 flex items-center justify-center">
                {settings?.logo_barangay_url ? (
                    <img
                        src={settings.logo_barangay_url}
                        alt="Barangay Logo"
                        className="w-full h-full object-contain"
                    />
                ) : (
                    <div className="w-full h-full border border-gray-300 flex items-center justify-center bg-gray-50">
                        <span className="text-[10px] text-gray-500 text-center">Barangay Logo</span>
                    </div>
                )}
            </div>

            {/* Right Logo (City/Muni) */}
            <div className="absolute right-0 top-0 w-24 h-24 flex items-center justify-center">
                {settings?.logo_city_url ? (
                    <img
                        src={settings.logo_city_url}
                        alt="City/Muni Logo"
                        className="w-full h-full object-contain"
                    />
                ) : (
                    <div className="w-full h-full border border-gray-300 flex items-center justify-center bg-gray-50">
                        <span className="text-[10px] text-gray-500 text-center">City/Muni Logo</span>
                    </div>
                )}
            </div>

            <div className="px-28"> {/* Padding to avoid overlapping logos */}
                <p className="text-sm font-serif">Republic of the Philippines</p>
                <p className="text-sm font-serif">Province of {province}</p>
                <p className="text-sm font-serif">City/Municipality of {city}</p>
                <h1 className="font-bold uppercase mt-2 text-lg font-serif">Barangay {barangayName}</h1>
                <h2 className="font-bold uppercase mt-1 text-xl font-serif">Office of the Lupong Tagapamayapa</h2>
            </div>
        </div>
    )
}
