'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

type SidebarItemProps = {
    href: string
    icon: React.ReactNode
    label: string
    badge?: number
}

export default function SidebarItem({ href, icon, label, badge }: SidebarItemProps) {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Base path check
    const isPathMatch = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

    let isActive = isPathMatch

    // If href contains query params, check if they match the current search params
    if (href.includes('?')) {
        const [path, query] = href.split('?')
        const hrefParams = new URLSearchParams(query)
        const currentParams = new URLSearchParams(searchParams.toString())

        let paramsMatch = true
        hrefParams.forEach((value, key) => {
            if (currentParams.get(key) !== value) {
                paramsMatch = false
            }
        })

        // Strict check: Path must match AND params must match
        isActive = pathname === path && paramsMatch
    }

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
