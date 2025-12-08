/**
 * Shared TypeScript types for the application
 */

// Action result type for consistent server action responses
export type ActionResult<T = unknown> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string };

// Case related types
export type IncidentType =
  | "Theft"
  | "Harassment"
  | "Vandalism"
  | "Physical Injury"
  | "Property Damage"
  | "Public Disturbance"
  | "Other";

export type CaseStatus =
  | "New"
  | "Under Investigation"
  | "Hearing Scheduled"
  | "Settled"
  | "Closed"
  | "Dismissed"
  | "Referred";

export type PartyType = "Complainant" | "Respondent" | "Witness";

export interface CaseFormData {
  title: string;
  incident_type: IncidentType;
  narrative_facts: string;
  narrative_action?: string;
  incident_date: string;
  incident_location: string;
}

export interface InvolvedParty {
  id?: string; // Optional for new parties
  case_id?: string;
  name: string;
  type: PartyType;
  contact_number?: string;
  email?: string;
  address?: string;
  created_at?: string;
}

export interface CaseNote {
  id: string;
  case_id: string;
  content: string;
  created_by: string;
  created_at: string;
}

export interface Evidence {
  id: string;
  case_id: string;
  file_path: string;
  file_name: string;
  file_type: string;
  description?: string;
  uploaded_by?: string;
  created_at: string;
}

export interface GuestLink {
  id: string;
  case_id: string;
  token: string;
  pin: string;
  created_by: string;
  expires_at: string;
  is_active: boolean;
  recipient_name?: string;
  recipient_email?: string;
  recipient_phone?: string;
  created_at: string;
}

export interface Hearing {
  id: string;
  case_id: string;
  hearing_date: string;
  hearing_type: "Mediation" | "Conciliation" | "Arbitration";
  status: "Scheduled" | "Completed" | "No Show" | "Rescheduled" | "Settled";
  notes?: string;
  created_at: string;
}

// Form state for useFormState hook
export interface FormState<T = unknown> {
  success?: boolean;
  error?: string;
  data?: T;
}

export interface BarangaySettings {
  id: string;
  barangay_name: string;
  municipality: string;
  province: string;
  logo_url?: string;
  contact_number?: string;
  email?: string;
  address?: string;
  captain_name?: string;
}

export interface ResolutionDetails {
  type: "Dismissed" | "Referred" | "Settled" | "Closed";
  reason?: string;
  agency?: string;
  terms?: string;
  date: string;
  officer: string;
  notes?: string;
  resolution_type?: string;
}

export interface Case {
  id: string;
  case_number: number;
  title: string;
  status: CaseStatus;
  incident_date: string;
  incident_location: string;
  incident_type: IncidentType;
  narrative_facts?: string;
  narrative_action?: string;
  description?: string; // Legacy or alias for narrative_facts?
  resolution_details?: ResolutionDetails | null;
  reported_by?: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  case_id?: string;
  action: string;
  details?: Record<string, unknown>;
  created_at: string;
}

// Document and Settings Types
export type SystemSettings = BarangaySettings;

// Analytics and Dashboard Types
export interface StatusDataItem {
  name: string;
  value: number;
  color?: string;
}

export interface TypeDataItem {
  name: string;
  value: number;
  color?: string;
}

export interface TrendDataItem {
  name: string;
  cases: number;
  month?: string;
}

export interface AnalyticsData {
  statusData: StatusDataItem[];
  typeData: TypeDataItem[];
  trendData: TrendDataItem[];
}

// Document Component Types
export interface DocumentProps {
  caseData: Case;
  involvedParties: InvolvedParty[];
  settings: SystemSettings;
  evidence?: Evidence[];
  hearings?: Hearing[];
}

export interface PrintableDocumentProps extends DocumentProps {
  complainants: InvolvedParty[];
  respondents: InvolvedParty[];
  details: Case;
}

// Timeline Types
export interface TimelineEvent {
  id: string;
  type: "note" | "audit" | "evidence" | "hearing" | "status_change";
  timestamp: string;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  user?: string;
}
