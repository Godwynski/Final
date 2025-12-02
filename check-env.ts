import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

console.log('Checking Environment Variables for MailerSend:');
console.log('MAILERSEND_API_KEY:', process.env.MAILERSEND_API_KEY ? 'Present' : 'Missing');
console.log('MAILERSEND_FROM_EMAIL:', process.env.MAILERSEND_FROM_EMAIL ? 'Present' : 'Missing (Using default)');
console.log('MAILERSEND_FROM_NAME:', process.env.MAILERSEND_FROM_NAME ? 'Present' : 'Missing (Using default)');

if (process.env.MAILERSEND_API_KEY) {
    console.log('API Key Length:', process.env.MAILERSEND_API_KEY.length);
}
