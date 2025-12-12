import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js'

const logFile = path.resolve(process.cwd(), 'env-check.log');
const log = (msg: string) => fs.appendFileSync(logFile, msg + '\n'); // Append mode

fs.writeFileSync(logFile, 'Starting check...\n'); // Reset file

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

log(`URL: ${url ? 'Present' : 'Missing'}`);
log(`Key: ${key ? 'Present' : 'Missing'}`);

if (url && key) {
    const supabase = createClient(url, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    supabase.auth.admin.listUsers({ page: 1, perPage: 1 })
        .then(({ data, error }) => {
            if (error) {
                log('Error listing users: ' + JSON.stringify(error, null, 2));
            } else {
                log('Successfully listed users. Count: ' + (data.users ? data.users.length : 0));
            }
        })
        .catch(err => log('Exception: ' + err));

    supabase.from('profiles').select('*').limit(1)
        .then(({ data, error }) => {
            if (error) {
                log('Error listing profiles: ' + JSON.stringify(error, null, 2));
            } else {
                log('Successfully listed profiles. Count: ' + (data ? data.length : 0));
            }
        });
} else {
    log('Env vars missing, skipping test.');
}
