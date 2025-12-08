import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function NotFound() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center max-w-lg">
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center dark:bg-blue-900/30">
            <svg
              className="w-12 h-12 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Oops! The page you are looking for seems to have gone missing. It
          might have been removed, renamed, or doesn&apos;t exist.
        </p>

        <div className="flex justify-center">
          <Link
            href={user ? "/dashboard" : "/"}
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 transition-colors"
          >
            {user ? "Go to Dashboard" : "Back to Home"}
          </Link>
        </div>
      </div>
    </div>
  );
}
