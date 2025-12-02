'use client'

import { useState } from 'react'

export default function ExportButton({ data }: { data: any }) {
    const [isExporting, setIsExporting] = useState(false)

    const handleExport = () => {
        setIsExporting(true)
        try {
            // Flatten data for CSV
            // We'll export the raw cases list if available, or the summary stats
            // For now, let's assume we want to export the summary stats as a simple report

            const csvContent = "data:text/csv;charset=utf-8,"
                + "Category,Name,Value\n"
                + data.statusData.map((d: any) => `Status,${d.name},${d.value}`).join("\n") + "\n"
                + data.typeData.map((d: any) => `Type,${d.name},${d.value}`).join("\n") + "\n"
                + data.trendData.map((d: any) => `Trend,${d.name},${d.cases}`).join("\n");

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `dashboard_analytics_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Export failed", error)
            alert("Failed to export data")
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50"
        >
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {isExporting ? 'Exporting...' : 'Export CSV'}
        </button>
    )
}
