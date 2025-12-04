export const CASE_STATUS = {
    NEW: 'New',
    UNDER_INVESTIGATION: 'Under Investigation',
    HEARING_SCHEDULED: 'Hearing Scheduled',
    SETTLED: 'Settled',
    CLOSED: 'Closed',
    DISMISSED: 'Dismissed',
    REFERRED: 'Referred',
} as const

export const INCIDENT_TYPE = {
    THEFT: 'Theft',
    HARASSMENT: 'Harassment',
    VANDALISM: 'Vandalism',
    PHYSICAL_INJURY: 'Physical Injury',
    PROPERTY_DAMAGE: 'Property Damage',
    PUBLIC_DISTURBANCE: 'Public Disturbance',
    OTHER: 'Other',
} as const

export const PARTY_TYPE = {
    COMPLAINANT: 'Complainant',
    RESPONDENT: 'Respondent',
    WITNESS: 'Witness',
} as const

export type CaseStatus = typeof CASE_STATUS[keyof typeof CASE_STATUS]
export type IncidentType = typeof INCIDENT_TYPE[keyof typeof INCIDENT_TYPE]
export type PartyType = typeof PARTY_TYPE[keyof typeof PARTY_TYPE]
