import { MailerSend } from "mailersend";

const apiKey = process.env.MAILERSEND_API_KEY || '';

if (!process.env.MAILERSEND_API_KEY) {
    console.warn('MAILERSEND_API_KEY is missing. Email sending will fail.');
}

export const mailersend = new MailerSend({
    apiKey: apiKey,
});
