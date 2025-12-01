import { z } from 'zod'
import { CONFIG } from '@/constants/config'

// Case creation validation
export const createCaseSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
    incident_type: z.enum(['Theft', 'Harassment', 'Vandalism', 'Physical Injury', 'Property Damage', 'Public Disturbance', 'Other']),
    narrative_facts: z.string().min(10, 'Please provide more details in the facts'),
    narrative_action: z.string().optional(),
    incident_date: z.string().refine((date) => new Date(date) <= new Date(), {
        message: 'Incident date cannot be in the future',
    }),
    incident_location: z.string().min(1, 'Location is required'),
})

// Update case details validation
export const updateCaseDetailsSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
    incident_type: z.enum(['Theft', 'Harassment', 'Vandalism', 'Physical Injury', 'Property Damage', 'Public Disturbance', 'Other']),
    narrative_facts: z.string().min(10, 'Please provide more details in the facts'),
    narrative_action: z.string().optional(),
    incident_date: z.string().refine((date) => new Date(date) <= new Date(), {
        message: 'Incident date cannot be in the future',
    }),
    incident_location: z.string().min(1, 'Location is required'),
})

// Involved party validation
export const addInvolvedPartySchema = z.object({
    name: z.string()
        .min(CONFIG.INVOLVED_PARTY.NAME_MIN_LENGTH, `Name must be at least ${CONFIG.INVOLVED_PARTY.NAME_MIN_LENGTH} characters`)
        .max(CONFIG.INVOLVED_PARTY.NAME_MAX_LENGTH, `Name must be less than ${CONFIG.INVOLVED_PARTY.NAME_MAX_LENGTH} characters`),
    type: z.enum(['Complainant', 'Respondent', 'Witness']),
    contact_number: z.string()
        .regex(/^[0-9+\-\s()]*$/, 'Invalid phone number format')
        .optional()
        .or(z.literal('')),
    email: z.string()
        .email('Invalid email address')
        .optional()
        .or(z.literal('')),
    address: z.string()
        .max(CONFIG.INVOLVED_PARTY.ADDRESS_MAX_LENGTH, `Address is too long (max ${CONFIG.INVOLVED_PARTY.ADDRESS_MAX_LENGTH} characters)`)
        .optional()
        .or(z.literal('')),
})

// Case note validation
export const addCaseNoteSchema = z.object({
    content: z.string()
        .min(CONFIG.CASE_NOTE.MIN_LENGTH, 'Note cannot be empty')
        .max(CONFIG.CASE_NOTE.MAX_LENGTH, `Note is too long (max ${CONFIG.CASE_NOTE.MAX_LENGTH} characters)`),
})

// Action taken/narrative update validation
export const updateActionTakenSchema = z.object({
    narrative_action: z.string()
        .min(1, 'Action taken cannot be empty')
        .max(CONFIG.CASE_NOTE.MAX_LENGTH, `Action description is too long`),
})

// User creation validation
export const createUserSchema = z.object({
    email: z.string().email('Invalid email address'),
    full_name: z.string().min(2, 'Full name is required'),
    role: z.enum(['admin', 'staff']),
})

// Password validation with strong requirements
export const passwordSchema = z.string()
    .min(CONFIG.PASSWORD.MIN_LENGTH, `Password must be at least ${CONFIG.PASSWORD.MIN_LENGTH} characters`)
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')

// Guest link duration validation
export const guestLinkDurationSchema = z.number()
    .int('Duration must be a whole number')
    .min(CONFIG.GUEST_LINK.MIN_DURATION_HOURS, `Duration must be at least ${CONFIG.GUEST_LINK.MIN_DURATION_HOURS} hour`)
    .max(CONFIG.GUEST_LINK.MAX_DURATION_HOURS, `Duration cannot exceed ${CONFIG.GUEST_LINK.MAX_DURATION_HOURS} hours`)

// File upload validation
export const fileUploadSchema = z.object({
    file: z.custom<File>((val) => val instanceof File, 'File is required')
        .refine((file) => file.size <= CONFIG.FILE_UPLOAD.MAX_SIZE,
            `File size must be less than ${CONFIG.FILE_UPLOAD.MAX_SIZE_MB}MB`)
        .refine((file) => CONFIG.FILE_UPLOAD.ALLOWED_TYPES.includes(file.type as any),
            `Only ${CONFIG.FILE_UPLOAD.ALLOWED_TYPES.join(', ')} files are allowed`),
    description: z.string().max(500, 'Description is too long').optional(),
})

// Hearing validation
export const scheduleHearingSchema = z.object({
    hearing_date: z.string().refine((date) => new Date(date) > new Date(), {
        message: 'Hearing date must be in the future',
    }),
    hearing_type: z.enum(['Mediation', 'Conciliation', 'Arbitration']),
    notes: z.string().max(1000, 'Notes are too long').optional(),
})

