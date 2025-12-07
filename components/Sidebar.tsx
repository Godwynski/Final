'use client'

import Link from 'next/link'
import { signout } from '@/app/login/actions'
import SidebarItem from './sidebar/SidebarItem'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import {
    LayoutDashboard,
    Briefcase,
    Users,
    UserCog,
    FileClock,
    User,
    Settings,
    Shield,
    LogOut,
    Plus
} from 'lucide-react'

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
                <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800 flex flex-col justify-between no-scrollbar">
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
                                <Plus className="w-4 h-4 mr-2" />
                                New Case
                            </Link>
                        </li>

                        {/* Dashboard */}
                        <SidebarItem
                            href="/dashboard"
                            label="Dashboard"
                            icon={<LayoutDashboard className="w-5 h-5" />}
                        />

                        {/* Case Management Section */}
                        <li className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                            <span className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                Case Management
                            </span>
                        </li>
                        <SidebarItem
                            href="/dashboard/cases"
                            label="Blotter Cases"
                            badge={newCasesCount}
                            icon={<Briefcase className="w-5 h-5" />}
                        />
                        <SidebarItem
                            href="/dashboard/people"
                            label="People Directory"
                            icon={<Users className="w-5 h-5" />}
                        />

                        {/* Administration Section */}
                        {role === 'admin' && (
                            <>
                                <li className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                                    <span className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                        Administration
                                    </span>
                                </li>
                                <SidebarItem
                                    href="/dashboard/admin?tab=users"
                                    label="User Management"
                                    icon={<UserCog className="w-5 h-5" />}
                                />
                                <SidebarItem
                                    href="/dashboard/admin?tab=logs"
                                    label="System Audit Logs"
                                    icon={<FileClock className="w-5 h-5" />}
                                />
                            </>
                        )}

                        {/* Settings Section */}
                        <li className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                            <span className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                Settings
                            </span>
                        </li>
                        <SidebarItem
                            href="/dashboard/settings?tab=profile"
                            label="Profile"
                            icon={<User className="w-5 h-5" />}
                        />
                        <SidebarItem
                            href="/dashboard/settings?tab=system"
                            label="System"
                            icon={<Settings className="w-5 h-5" />}
                        />
                        <SidebarItem
                            href="/dashboard/settings?tab=security"
                            label="Security"
                            icon={<Shield className="w-5 h-5" />}
                        />
                    </ul>
                    <div className="pt-4 mt-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
                        <form action={signout}>
                            <button type="submit" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">
                                <LogOut className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                <span className="ms-3">Sign Out</span>
                            </button>
                        </form>
                    </div>
                </div>
            </aside >
        </>
    )
}
