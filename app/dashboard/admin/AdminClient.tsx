'use client'

import { useState, ReactNode } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { createUser } from './actions'
import { toast } from 'sonner'

type AdminClientProps = {
    usersTabContent: ReactNode
    logsTabContent: ReactNode
}

export function AdminClient({ usersTabContent, logsTabContent }: AdminClientProps) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const [isModalOpen, setIsModalOpen] = useState(false)

    const activeTab = searchParams.get('tab') === 'logs' ? 'logs' : 'users'

    const handleTabChange = (tab: 'users' | 'logs') => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('tab', tab)
        // Reset page when switching tabs
        params.delete('page')
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">

                {/* Tabs - Removed as per new sidebar navigation */}
                <div className="hidden"></div>

                {/* Create User Button (Only visible on Users tab) */}
                {activeTab === 'users' && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 transition-colors shadow-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        Create New User
                    </button>
                )}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {/* USERS TAB */}
                <div className={activeTab === 'users' ? 'block animate-fadeIn' : 'hidden'}>
                    {usersTabContent}
                </div>

                {/* LOGS TAB */}
                <div className={activeTab === 'logs' ? 'block animate-fadeIn' : 'hidden'}>
                    {logsTabContent}
                </div>
            </div>

            {/* Create User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto bg-gray-900/60 backdrop-blur-sm transition-opacity">
                    <div className="relative w-full max-w-md max-h-full transform transition-all scale-100">
                        <div className="relative bg-white rounded-xl shadow-2xl dark:bg-gray-800 border dark:border-gray-700">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-700">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Create New Staff Account
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white transition-colors"
                                >
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>

                            <div className="p-4 md:p-5">
                                <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                                    <p className="flex items-center gap-2">
                                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                                        Default password is <strong>Blotter123!</strong>
                                    </p>
                                </div>

                                <form action={async (formData) => {
                                    const result = await createUser(formData)
                                    if (result?.error) {
                                        toast.error(result.error)
                                    } else {
                                        toast.success('User created successfully')
                                        setIsModalOpen(false)
                                    }
                                }} className="space-y-4">
                                    <div>
                                        <label htmlFor="full_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full Name</label>
                                        <input type="text" name="full_name" id="full_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John Doe" required />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email Address</label>
                                        <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required />
                                    </div>
                                    <div>
                                        <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role</label>
                                        <select name="role" id="role" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                            <option value="staff">Staff</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-colors mt-2">
                                        Create Account
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
