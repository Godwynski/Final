import BackButton from '@/components/ui/BackButton'
import CreateCaseForm from './CreateCaseForm'

export default function NewCasePage() {
    return (
        <div className="p-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="w-full mx-auto bg-white rounded-lg shadow dark:bg-gray-800 p-6">
                <BackButton />
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Create New Blotter Report</h1>
                <CreateCaseForm />
            </div>
        </div>
    )
}

