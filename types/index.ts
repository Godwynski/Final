/**
 * Shared TypeScript types for the application
 */

// Action result type for consistent server action responses
export type ActionResult<T = unknown> =
    | { success: true; data?: T; message?: string }
    | { success: false; error: string }

// Case related types
export type IncidentType =
    | 'Theft'
    | 'Harassment'
    | 'Vandalism'
    | 'Physical Injury'
    | 'Property Damage'
    | 'Public Disturbance'
    | 'Other'

export type CaseStatus =
    | 'New'
    | 'Under Investigation'
    | 'Hearing Scheduled'
    | 'Settled'
    | 'Closed'
    | 'Dismissed'
    | 'Referred'

export type PartyType = 'Complainant' | 'Respondent' | 'Witness'

export interface CaseFormData {
    title: string
    incident_type: IncidentType
    narrative_facts: string
    narrative_action?: string
    incident_date: string
    incident_location: string
}

export interface InvolvedParty {
    id?: string
    case_id?: string
    name: string
    type: PartyType
    contact_number?: string
    email?: string
    address?: string
    created_at?: string
}

export interface CaseNote {
    id: string
    case_id: string
    content: string
    created_by: string
    created_at: string
}

export interface Evidence {
    id: string
    case_id: string
    file_path: string
    file_name: string
    file_type: string
    description?: string
    uploaded_by?: string
    created_at: string
}

export interface GuestLink {
    id: string
    case_id: string
    token: string
    pin: string
    created_by: string
    expires_at: string
    is_active: boolean
    created_at: string
}

export interface AuditLog {
    id: string
    user_id?: string
    case_id?: string
    action: string
    details?: Record<string, any>
    created_at: string
}

export interface Profile {
    id: string
    email: string
    full_name: string | null
    role: 'admin' | 'staff'
    force_password_change: boolean
    created_at: string
}

export interface Hearing {
    id: string
    case_id: string
    hearing_date: string
    hearing_type: 'Mediation' | 'Conciliation' | 'Arbitration'
    status: 'Scheduled' | 'Completed' | 'No Show' | 'Rescheduled' | 'Settled'
    notes?: string
    created_at: string
}

// Form state for useFormState hook
export interface FormState<T = unknown> {
    success?: boolean
    error?: string
    data?: T
}
