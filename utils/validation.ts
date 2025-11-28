import { z } from 'zod'

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

export const createUserSchema = z.object({
    email: z.string().email('Invalid email address'),
    full_name: z.string().min(2, 'Full name is required'),
    role: z.enum(['admin', 'staff']),
})

export const uploadEvidenceSchema = z.object({
    description: z.string().optional(),
})
