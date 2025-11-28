'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signout } from '@/app/login/actions'

export default function Sidebar({ role, email }: { role: string, email: string }) {
    const pathname = usePathname()

    // Helper to determine active state
    const isActive = (path: string) => {
        if (path === '/dashboard' && pathname === '/dashboard') return true
        if (path !== '/dashboard' && pathname.startsWith(path)) return true
        return false
    }

    return (
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen sticky top-0 shrink-0 print:hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Blotter System</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate" title={email}>{email}</p>
                <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold leading-none text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300 uppercase">
                    {role}
                </span>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <Link href="/dashboard" className={`flex items-center p-3 rounded-lg group transition-colors ${isActive('/dashboard') ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
                    <span className="ml-3">Dashboard</span>
                </Link>

                <Link href="/dashboard/cases" className={`flex items-center p-3 rounded-lg group transition-colors ${isActive('/dashboard/cases') ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path></svg>
                    <span className="ml-3">Blotter Cases</span>
                </Link>

                {role === 'admin' && (
                    <Link href="/dashboard/admin" className={`flex items-center p-3 rounded-lg group transition-colors ${isActive('/dashboard/admin') ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                        <span className="ml-3">Admin Panel</span>
                    </Link>
                )}

                <Link href="/dashboard/settings" className={`flex items-center p-3 rounded-lg group transition-colors ${isActive('/dashboard/settings') ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path></svg>
                    <span className="ml-3">Settings</span>
                </Link>
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <form action={signout}>
                    <button type="submit" className="flex items-center w-full p-3 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-500 transition-colors">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        <span className="ml-3">Sign Out</span>
                    </button>
                </form>
            </div>
        </aside>
    )
}
