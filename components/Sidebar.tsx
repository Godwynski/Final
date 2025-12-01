'use client'

import Link from 'next/link'
import { signout } from '@/app/login/actions'
import SidebarItem from './sidebar/SidebarItem'
import SidebarGroup from './sidebar/SidebarGroup'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

type SidebarProps = {
    role: string
    email: string
    isOpen?: boolean
    onClose?: () => void
    newCasesCount?: number
}

export default function Sidebar({ role, email, isOpen, onClose, newCasesCount }: SidebarProps) {
    const pathname = usePathname()

    // Close sidebar on route change (mobile)
    useEffect(() => {
        if (isOpen && onClose) {
            onClose()
        }
    }, [pathname])

    return (
        <>
            {/* Backdrop overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 sm:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 print:hidden ${isOpen
                    ? 'translate-x-0'
                    : '-translate-x-full sm:translate-x-0 invisible sm:visible'
                    }`}
                aria-label="Sidebar"
            >
                <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800 flex flex-col justify-between">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <div className="px-2 py-2 mb-2 flex items-center justify-between">
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 uppercase">
                                    {role}
                                </span>
                            </div>
                        </li>

                        {/* Quick Action: New Case */}
                        <li>
                            <Link
                                href="/dashboard/cases/new"
                                className="flex items-center justify-center w-full p-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 mb-4"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                New Case
                            </Link>
                        </li>

                        {/* Dashboard */}
                        <SidebarItem
                            href="/dashboard"
                            label="Dashboard"
                            icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            }
                        />

                        {/* Case Management Group */}
                        <SidebarGroup
                            label="Case Management"
                            groupKey="case-management"
                            icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            }
                        >
                            <SidebarItem
                                href="/dashboard/cases"
                                label="Blotter Cases"
                                badge={newCasesCount}
                                icon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                }
                            />
                        </SidebarGroup>

                        {/* Administration Group */}
                        <SidebarGroup
                            label="Administration"
                            groupKey="administration"
                            icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            }
                        >
                            {role === 'admin' && (
                                <SidebarItem
                                    href="/dashboard/admin"
                                    label="Admin Panel"
                                    icon={
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    }
                                />
                            )}
                            <SidebarItem
                                href="/dashboard/settings"
                                label="Settings"
                                icon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                    </svg>
                                }
                            />
                        </SidebarGroup>
                    </ul>
                    <div className="pt-4 mt-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
                        <form action={signout}>
                            <button type="submit" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">
                                <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="ms-3">Sign Out</span>
                            </button>
                        </form>
                    </div>
                </div>
            </aside>
        </>
    )
}
