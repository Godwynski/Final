import Link from 'next/link'
import { LoginForm } from './login-form'

export default async function LoginPage(props: { searchParams: Promise<{ message?: string, error?: string }> }) {
    const searchParams = await props.searchParams
    return (
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 bg-gray-50 dark:bg-gray-900">
            <Link href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                <span className="mr-2">⚖️</span>
                Blotter System
            </Link>
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Sign in to your account
                    </h1>

                    {searchParams.message && (
                        <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-700 dark:text-green-400" role="alert">
                            <span className="font-medium">Success!</span> {searchParams.message}
                        </div>
                    )}

                    {searchParams.error && (
                        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-700 dark:text-red-400" role="alert">
                            <span className="font-medium">Error!</span> {searchParams.error}
                        </div>
                    )}

                    <LoginForm />
                </div>
            </div>
            <Link href="/" className="mt-6 flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Back to Home
            </Link>
        </div>
    )
}

