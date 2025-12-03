export function PasswordRequirements({ password }: { password: string }) {
    const requirements = [
        { label: 'At least 8 characters', met: password.length >= 8 },
        { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
        { label: 'Contains lowercase letter', met: /[a-z]/.test(password) },
        { label: 'Contains number', met: /[0-9]/.test(password) },
        { label: 'Contains special character', met: /[^a-zA-Z0-9]/.test(password) },
    ]

    return (
        <div className="mt-2 space-y-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Password Requirements:</p>
            {requirements.map((req, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                    {req.met ? (
                        <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    ) : (
                        <svg className="w-3 h-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    )}
                    <span className={req.met ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-500'}>
                        {req.label}
                    </span>
                </div>
            ))}
        </div>
    )
}
