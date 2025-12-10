import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ChangePasswordForm from "./ChangePasswordForm";

export default async function ChangePasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          Set New Password
        </h1>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Please enter your new password below.
        </p>

        <ChangePasswordForm />
      </div>
    </div>
  );
}
