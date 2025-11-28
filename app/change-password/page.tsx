import { updatePassword } from './actions'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function ChangePasswordPage(props: { searchParams: Promise<{ error?: string }> }) {
    const searchParams = await props.searchParams
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h1 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">Change Password</h1>
                <p className="text-center text-gray-500 mb-6 text-sm">
                    For your security, you are required to change your password before proceeding.
                </p>

                {searchParams.error && (
                    <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                        <span className="font-medium">Error!</span> {searchParams.error}
                    </div>
                )}

                <form action={updatePassword} className="space-y-6">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            minLength={6}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm New Password</label>
                        <input
                            type="password"
                            name="confirm_password"
                            required
                            minLength={6}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    )
}
