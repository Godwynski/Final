'use client'

import { useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function DashboardShell({
    children,
    userProfile
}: {
    children: React.ReactNode
    userProfile: { full_name: string | null, email: string, role: string, newCasesCount?: number }
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="print:hidden">
                <Navbar
                    name={userProfile.full_name || userProfile.email}
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />
                <Sidebar
                    role={userProfile.role}
                    email={userProfile.email}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    newCasesCount={userProfile.newCasesCount}
                />
            </div>
            <div className="p-4 sm:ml-64 pt-20 print:ml-0 print:pt-0 print:p-0">
                <main className="print:p-0 print:overflow-visible">
                    {children}
                </main>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-gray-900/50 sm:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    )
}
