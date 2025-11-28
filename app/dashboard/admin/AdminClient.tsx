'use client'

import { useState, ReactNode } from 'react'
import { createUser } from './actions'

type AdminClientProps = {
    usersTabContent: ReactNode
    logsTabContent: ReactNode
}

export function AdminClient({ usersTabContent, logsTabContent }: AdminClientProps) {
    const [activeTab, setActiveTab] = useState<'users' | 'logs'>('users')
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex justify-between items-center">

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                        <li className="me-2">
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'users' ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
                            >
                                User Management
                            </button>
                        </li>
                        <li className="me-2">
                            <button
                                onClick={() => setActiveTab('logs')}
                                className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'logs' ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
                            >
                                System Audit Logs
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Create User Button (Only visible on Users tab) */}
                {activeTab === 'users' && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                        + Create New User
                    </button>
                )}
            </div>

            {/* Tab Content */}
            <div>
                {/* USERS TAB */}
                <div className={activeTab === 'users' ? 'block' : 'hidden'}>
                    {usersTabContent}
                </div>

                {/* LOGS TAB */}
                <div className={activeTab === 'logs' ? 'block' : 'hidden'}>
                    {logsTabContent}
                </div>
            </div>

            {/* Create User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full bg-gray-900/50 backdrop-blur-sm">
                    <div className="relative w-full max-w-md max-h-full">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <div className="px-6 py-6 lg:px-8">
                                <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Create New Staff Account</h3>
                                <p className="text-sm text-gray-500 mb-4">Default password: <strong>Blotter123!</strong></p>
                                <form action={async (formData) => {
                                    await createUser(formData)
                                    setIsModalOpen(false)
                                }} className="space-y-6">
                                    <div>
                                        <label htmlFor="full_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full Name</label>
                                        <input type="text" name="full_name" id="full_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="John Doe" required />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                        <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" required />
                                    </div>
                                    <div>
                                        <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role</label>
                                        <select name="role" id="role" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
                                            <option value="staff">Staff</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create Account</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
