'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

type SidebarGroupProps = {
    label: string
    icon: React.ReactNode
    children: React.ReactNode
    groupKey: string
}

export default function SidebarGroup({ label, icon, children, groupKey }: SidebarGroupProps) {
    const pathname = usePathname()
    // Check if any child link is active to auto-expand
    // This is a simple heuristic; for more complex nesting, we might need context or props
    const isActiveGroup = false // We'll rely on localStorage or manual toggle mostly, but could auto-expand if needed

    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const storedState = localStorage.getItem(`sidebar-group-${groupKey}`)
        if (storedState) {
            setIsOpen(storedState === 'true')
        } else {
            // Auto-expand if we are in this section (heuristic)
            // For simplicity, let's just default to closed unless stored
        }
    }, [groupKey])

    const toggle = () => {
        const newState = !isOpen
        setIsOpen(newState)
        localStorage.setItem(`sidebar-group-${groupKey}`, String(newState))
    }

    return (
        <li>
            <button
                type="button"
                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                onClick={toggle}
            >
                <span className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white">
                    {icon}
                </span>
                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">{label}</span>
                <svg
                    className={`w-3 h-3 transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                >
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
            </button>
            <ul
                className={`py-2 space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                {children}
            </ul>
        </li>
    )
}
