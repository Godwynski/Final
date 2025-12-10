"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

export async function forgotPassword(formData: FormData) {
  const email = formData.get("email") as string;
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email) {
    return { error: "Email is required" };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/change-password`,
  });

  if (error) {
    return { error: "Could not send reset link. Please try again." };
  }

  return { success: "Check your email for the password reset link" };
}
