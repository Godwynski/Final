import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

async function checkBuckets() {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error("Error listing buckets:", error);
  } else {
    console.log(
      "Buckets:",
      data.map((b) => b.name),
    );
    const branding = data.find((b) => b.name === "branding");
    if (branding) {
      console.log("Branding bucket found:", branding);
    } else {
      console.error("Branding bucket NOT found!");
    }
  }
}

checkBuckets();
