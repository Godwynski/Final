import { createAdminClient } from '@/utils/supabase/admin'
import { notFound } from 'next/navigation'
import { uploadGuestEvidence } from './actions'
import { cookies } from 'next/headers'
import PinEntryForm from './pin-form'

export default async function GuestPage(props: { params: Promise<{ token: string }> }) {
    const params = await props.params
    const { token } = params
    const supabaseAdmin = createAdminClient()

    // 1. Fetch Link Details (Bypass RLS to check validity)
    const { data: link, error } = await supabaseAdmin
        .from('guest_links')
        .select('*, cases(*)')
        .eq('token', token)
        .single()

    if (error || !link) {
        return notFound()
    }

    const isExpired = new Date(link.expires_at) < new Date()
    if (isExpired || !link.is_active) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="p-8 text-center bg-white rounded-lg shadow dark:bg-gray-800">
                    <h1 className="mb-4 text-2xl font-bold text-red-600 dark:text-red-500">Access Expired</h1>
                    <p className="text-gray-500 dark:text-gray-400">This guest link has expired or is no longer active.</p>
                </div>
            </div>
        )
    }

    // 2. Check PIN Cookie
    const cookieStore = await cookies()
    const pinCookie = cookieStore.get(`guest_pin_${token}`)

    if (!pinCookie || pinCookie.value !== link.pin) {
        return <PinEntryForm token={token} />
    }

    // 3. Fetch Evidence (Authenticated via PIN)
    const { data: evidence } = await supabaseAdmin
        .from('evidence')
        .select('*')
        .eq('case_id', link.case_id)
        .order('created_at', { ascending: false })

    const caseData = link.cases

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow dark:bg-gray-800 p-8">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Guest Access Portal</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                Access granted via secure token. Expires at: {new Date(link.expires_at).toLocaleString()}
                            </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${caseData.status === 'New' ? 'bg-blue-100 text-blue-800' :
                            caseData.status === 'Settled' ? 'bg-green-100 text-green-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                            {caseData.status}
                        </span>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Case Info */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{caseData.title}</h2>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            {caseData.description}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Incident Date: {new Date(caseData.incident_date).toLocaleString()} • {caseData.incident_location}
                        </p>
                    </div>

                    {/* Evidence List */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Case Evidence</h3>
                        {evidence && evidence.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {evidence.map((item: any) => (
                                    <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-gray-900 dark:text-white truncate">{item.file_name}</span>
                                            <span className="text-xs text-gray-500 uppercase">{item.file_type}</span>
                                        </div>
                                        {item.description && <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{item.description}</p>}
                                        <div className="text-xs text-gray-400">
                                            Uploaded: {new Date(item.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No evidence uploaded yet.</p>
                        )}
                    </div>

                    {/* Upload Form */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Upload New Evidence</h3>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800">
                            <UploadForm token={token} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function UploadForm({ token }: { token: string }) {
    return (
        <form action={async (formData) => {
            'use server'
            await uploadGuestEvidence(token, formData)
        }} className="space-y-4">
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload file</label>
                <input name="file" className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" required />
            </div>
            <div>
                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                <textarea name="description" id="description" rows={2} className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Describe this evidence..."></textarea>
            </div>
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                Secure Upload
            </button>
        </form>
    )
}
