import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!key) {
    console.log("No key found");
    process.exit(1);
}

try {
    const parts = key.split('.');
    if (parts.length !== 3) throw new Error("Not a JWT");

    // Base64 decode. Handle standard base64 and url-safe base64
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
        base64 += '=';
    }

    const payload = JSON.parse(Buffer.from(base64, 'base64').toString());
    console.log("Token Role:", payload.role);
    // console.log("Payload:", JSON.stringify(payload, null, 2)); // Careful not to log sensitive data if not needed

    if (payload.role !== 'service_role') {
        console.error("ERROR: The configured SUPABASE_SERVICE_ROLE_KEY is NOT a service_role token. It is:", payload.role);
    } else {
        console.log("SUCCESS: Token is a valid service_role token.");
    }
} catch (e) {
    console.error("Invalid token format:", e.message);
}
