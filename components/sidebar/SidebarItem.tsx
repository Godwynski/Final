'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type SidebarItemProps = {
    href: string
    icon: React.ReactNode
    label: string
    badge?: number
}

export default function SidebarItem({ href, icon, label, badge }: SidebarItemProps) {
    const pathname = usePathname()
    const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

    return (
        <li>
            <Link
                href={href}
                className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${isActive ? 'bg-gray-100 dark:bg-gray-700' : ''
                    }`}
            >
                <span className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white ${isActive ? 'text-gray-900 dark:text-white' : ''
                    }`}>
                    {icon}
                </span>
                <span className="flex-1 ms-3 whitespace-nowrap">{label}</span>
                {badge !== undefined && badge > 0 && (
                    <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                        {badge}
                    </span>
                )}
            </Link>
        </li>
    )
}
