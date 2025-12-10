import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function createBuckets() {
  const buckets = ["branding", "evidence"];

  for (const bucket of buckets) {
    const { error } = await supabase.storage.createBucket(bucket, {
      public: bucket === "branding", // branding is public, evidence is private
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
    });

    if (error) {
      console.log(`Bucket '${bucket}' creation status:`, error.message);
    } else {
      console.log(`Bucket '${bucket}' created successfully.`);
    }
  }
}

createBuckets();
