'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import { User, Settings, Shield, Building2 } from 'lucide-react'

// Dynamic imports for the form components
const ProfileForm = dynamic(() => import('./ProfileForm'), { ssr: false })
const SystemSettingsForm = dynamic(() => import('./SystemSettingsForm'), { ssr: false })
const SecurityForm = dynamic(() => import('./SecurityForm'), { ssr: false })

type UserData = {
    email: string
    full_name: string | null
    role: string
}

type Tab = 'profile' | 'system' | 'security'

export default function SettingsClient({ user, settings }: { user: UserData, settings: any }) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    // Get active tab from URL or default to 'profile'
    const activeTab = (searchParams.get('tab') as Tab) || 'profile'

    const handleTabChange = (tab: Tab) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('tab', tab)
        router.push(`${pathname}?${params.toString()}`)
    }

    const tabs = [
        {
            id: 'profile',
            label: 'Profile',
            icon: User,
            description: 'Manage your personal information'
        },
        {
            id: 'system',
            label: 'System',
            icon: Building2,
            description: 'Configure global system settings'
        },
        {
            id: 'security',
            label: 'Security',
            icon: Shield,
            description: 'Update password and security preferences'
        }
    ] as const

    const currentTab = tabs.find(t => t.id === activeTab) || tabs[0]
    const CurrentIcon = currentTab.icon

    return (
        <div className="p-4 space-y-6 max-w-7xl mx-auto">
            {/* Header Card */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 shrink-0">
                    <CurrentIcon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{currentTab.label} Settings</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-2xl">{currentTab.description}</p>
                </div>
            </div>

            {/* Content Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                {activeTab === 'profile' && <ProfileForm user={user} />}
                {activeTab === 'system' && <SystemSettingsForm settings={settings} />}
                {activeTab === 'security' && <SecurityForm />}
            </div>
        </div>
    )
}

