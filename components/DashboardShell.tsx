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
        <div className="h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
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
            <div className="h-full p-4 sm:ml-64 pt-20 print:ml-0 print:pt-0 print:p-0 overflow-y-auto overflow-x-hidden">
                <main className="print:p-0 print:overflow-visible w-full max-w-full pb-10">
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
