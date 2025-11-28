import Link from 'next/link'
import { LoginForm } from './login-form'

export default async function LoginPage(props: { searchParams: Promise<{ message?: string, error?: string }> }) {
    const searchParams = await props.searchParams
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800 relative">
                <Link href="/" className="absolute top-4 left-4 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Back
                </Link>

                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mt-4">
                    Sign in to your account
                </h2>

                {searchParams.message && (
                    <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
                        <span className="font-medium">Success!</span> {searchParams.message}
                    </div>
                )}

                {searchParams.error && (
                    <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                        <span className="font-medium">Error!</span> {searchParams.error}
                    </div>
                )}

                <LoginForm />
            </div>
        </div>
    )
}

