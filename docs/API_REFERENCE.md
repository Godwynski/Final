# 📡 API Reference

Complete reference for **BlotterSys** server actions and API routes.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Case Management](#case-management)
- [Evidence Management](#evidence-management)
- [Guest Portal](#guest-portal)
- [Admin Functions](#admin-functions)
- [API Routes](#api-routes)
- [Error Codes](#error-codes)
- [Rate Limiting](#rate-limiting)

---

## Overview

BlotterSys uses **Next.js Server Actions** instead of traditional REST APIs. Server Actions are:
- Type-safe (TypeScript)
- Automatically secured
- Integrated with React Server Components
- No need for separate API routes (except for file downloads)

### Server Action Pattern

```typescript
"use server";

export async function actionName(formData: FormData) {
  // 1. Authenticate user
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // 2. Validate input
  const validation = schema.safeParse(data);
  
  // 3. Perform operation
  const { data, error } = await supabase.from('table').insert(...);
  
  // 4. Return result
  return { success: true, data };
}
```

---

## Authentication

### `loginAction(formData)`

**Location:** `app/login/actions.ts`

**Purpose:** Authenticate user with email and password

**Parameters:**
```typescript
{
  email: string;
  password: string;
}
```

**Returns:**
```typescript
{
  error?: string;
}
```

**Example:**
```typescript
const formData = new FormData();
formData.append('email', 'admin@barangay.local');
formData.append('password', 'password123');

const result = await loginAction(null, formData);
if (!result?.error) {
  // Login successful, redirects to dashboard
}
```

**Errors:**
- `"Invalid email or password"` - Credentials incorrect
- `"Too many attempts. Please try again in 15 minutes"` - Rate limited

---

### `changePassword(formData)`

**Location:** `app/change-password/actions.ts`

**Purpose:** Update user password

**Parameters:**
```typescript
{
  newPassword: string;
}
```

**Returns:**
```typescript
{
  error?: string;
}
```

**Requirements:**
- User must be authenticated
- Password must meet strength requirements

---

### `forgotPassword(formData)`

**Location:** `app/forgot-password/actions.ts`

**Purpose:** Send password reset email

**Parameters:**
```typescript
{
  email: string;
}
```

**Returns:**
```typescript
{
  error?: string;
}
```

**Behavior:**
- Sends email with reset link
- Link expires in 1 hour
- Redirects to `/change-password`

---

## Case Management

### `createCase(prevState, formData)`

**Location:** `app/dashboard/cases/actions.ts`

**Purpose:** Create a new case with involved parties

**Parameters:**
```typescript
{
  title: string;
  incident_type: string;
  incident_date: string; // ISO date
  incident_location: string;
  narrative_facts: string;
  narrative_action: string;
  involved_parties: string; // JSON array
}
```

**Involved Party Schema:**
```typescript
{
  name: string;
  type: 'complainant' | 'respondent' | 'witness';
  contact_number?: string;
  email?: string;
  address?: string;
}
```

**Returns:**
```typescript
{
  error?: string;
}
// On success: redirects to /dashboard/cases/{id}
```

**Example:**
```typescript
const formData = new FormData();
formData.append('title', 'Noise Complaint');
formData.append('incident_type', 'Noise Disturbance');
formData.append('incident_date', '2025-12-12');
formData.append('incident_location', '123 Main St');
formData.append('narrative_facts', 'Loud music at 2 AM');
formData.append('narrative_action', 'Issued warning');

const parties = [
  {
    name: 'Juan Dela Cruz',
    type: 'complainant',
    contact_number: '09171234567',
    address: '123 Main St'
  },
  {
    name: 'Maria Santos',
    type: 'respondent',
    contact_number: '09187654321',
    address: '124 Main St'
  }
];
formData.append('involved_parties', JSON.stringify(parties));

const result = await createCase(null, formData);
```

**Side Effects:**
- Auto-generates case number
- Creates audit log entry
- Sends email to admins (if high priority case)
- Creates notification for admins

**High Priority Types:**
- Physical Injury
- Theft
- Harassment

---

### `searchParties(query)`

**Location:** `app/dashboard/cases/actions.ts`

**Purpose:** Search for previously entered parties (autocomplete)

**Parameters:**
```typescript
query: string; // Minimum 2 characters
```

**Returns:**
```typescript
Array<{
  name: string;
  contact_number?: string;
  email?: string;
  address?: string;
}>
```

**Example:**
```typescript
const results = await searchParties('Juan');
// Returns: [{ name: 'Juan Dela Cruz', contact_number: '...', ... }]
```

**Behavior:**
- Case-insensitive search
- Searches by name only
- Returns max 5 results
- Deduplicates by name

---

### `updateCaseStatus(caseId, newStatus, resolutionDetails?)`

**Location:** `app/dashboard/cases/[id]/actions.ts`

**Purpose:** Update case status and optionally add resolution details

**Parameters:**
```typescript
{
  caseId: string;
  newStatus: 'New' | 'Under Investigation' | 'Hearing Scheduled' | 'Settled' | 'Dismissed' | 'Referred' | 'Closed';
  resolutionDetails?: {
    type: 'amicable_settlement' | 'dismissed' | 'referred';
    reason?: string;
    referral_agency?: string;
    settlement_terms?: string;
  };
}
```

**Returns:**
```typescript
{
  success: boolean;
  error?: string;
}
```

**Side Effects:**
- Creates audit log entry
- If terminal status (Settled/Dismissed/Referred/Closed):
  - Deactivates all guest links
  - Makes case read-only

**Terminal Statuses:** Settled, Dismissed, Referred, Closed

---

### `addNote(caseId, content)`

**Location:** `app/dashboard/cases/[id]/actions.ts`

**Purpose:** Add a note to a case

**Parameters:**
```typescript
{
  caseId: string;
  content: string;
}
```

**Returns:**
```typescript
{
  success: boolean;
  error?: string;
}
```

---

### `addHearing(caseId, hearingData)`

**Location:** `app/dashboard/cases/[id]/actions.ts`

**Purpose:** Schedule a hearing for a case

**Parameters:**
```typescript
{
  caseId: string;
  hearing_date: string; // ISO datetime
  hearing_type: 'Mediation' | 'Conciliation' | 'Arbitration';
  notes?: string;
}
```

**Returns:**
```typescript
{
  success: boolean;
  error?: string;
}
```

---

### `searchCases(params)`

**Location:** `app/dashboard/cases/actions.ts`

**Purpose:** Search and filter cases

**Parameters:**
```typescript
{
  query?: string; // Search term
  status?: string; // Filter by status
  incident_type?: string; // Filter by type
  date_from?: string; // ISO date
  date_to?: string; // ISO date
  sort_by?: 'case_number' | 'title' | 'status' | 'incident_date' | 'created_at';
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}
```

**Returns:**
```typescript
{
  cases: Array<Case>;
  total: number;
  page: number;
  per_page: number;
}
```

---

### `exportCasesToCSV(filters)`

**Location:** `app/dashboard/cases/actions.ts`

**Purpose:** Export filtered cases to CSV

**Parameters:**
```typescript
{
  status?: string;
  incident_type?: string;
  date_from?: string;
  date_to?: string;
}
```

**Returns:**
```typescript
{
  csv: string; // CSV content
  filename: string;
}
```

---

## Evidence Management

### `uploadEvidence(caseId, formData)`

**Location:** `app/dashboard/cases/[id]/actions.ts`

**Purpose:** Upload evidence files (staff/admin)

**Parameters:**
```typescript
{
  caseId: string;
  files: File[]; // Max 20 files, 10MB each
  description?: string;
  is_visible_to_others: boolean;
}
```

**Returns:**
```typescript
{
  success: boolean;
  error?: string;
}
```

**File Restrictions:**
- **Max size:** 10MB per file
- **Max count:** 20 files per upload
- **Allowed types:** JPEG, PNG, WebP, PDF

**Side Effects:**
- Compresses images client-side
- Stores in Supabase Storage
- Creates evidence metadata record
- Creates audit log entry

---

### `deleteEvidence(evidenceId)`

**Location:** `app/dashboard/cases/[id]/actions.ts`

**Purpose:** Delete evidence file

**Parameters:**
```typescript
{
  evidenceId: string;
}
```

**Returns:**
```typescript
{
  success: boolean;
  error?: string;
}
```

**Authorization:**
- Uploader can delete own evidence
- Admin can delete any evidence

**Side Effects:**
- Deletes file from storage
- Deletes metadata record
- Creates audit log entry

---

## Guest Portal

### `verifyGuestPin(token, pin)`

**Location:** `app/guest/[token]/actions.ts`

**Purpose:** Verify guest PIN and grant access

**Parameters:**
```typescript
{
  token: string;
  pin: string; // 6 digits
}
```

**Returns:**
```typescript
{
  success: boolean;
  error?: string;
  caseId?: string;
}
```

**Rate Limiting:**
- Max 3 attempts per 10 minutes
- Lockout after 3 failed attempts

**Errors:**
- `"Invalid PIN"` - PIN incorrect
- `"Too many attempts"` - Rate limited
- `"Link expired"` - Token expired
- `"Link inactive"` - Token deactivated

---

### `uploadGuestEvidence(token, formData)`

**Location:** `app/guest/[token]/actions.ts`

**Purpose:** Upload evidence as guest

**Parameters:**
```typescript
{
  token: string;
  files: File[]; // Max 3 files, 5MB each
  description?: string;
}
```

**Returns:**
```typescript
{
  success: boolean;
  error?: string;
}
```

**File Restrictions:**
- **Max size:** 5MB per file
- **Max count:** 3 files per upload
- **Allowed types:** JPEG, PNG, WebP

**Side Effects:**
- Compresses images client-side
- Stores in Supabase Storage
- Links to guest_link_id
- Creates audit log entry

---

### `acceptTerms(token, ipAddress)`

**Location:** `app/guest/[token]/actions.ts`

**Purpose:** Log terms acceptance

**Parameters:**
```typescript
{
  token: string;
  ipAddress: string;
}
```

**Returns:**
```typescript
{
  success: boolean;
}
```

**Side Effects:**
- Logs acceptance with timestamp and IP
- Required before accessing case data

---

### `createGuestLink(caseId, recipientData)`

**Location:** `app/dashboard/cases/[id]/actions.ts`

**Purpose:** Generate guest access link

**Parameters:**
```typescript
{
  caseId: string;
  recipient_name: string;
  recipient_email?: string;
  recipient_phone?: string;
  expires_in_hours: number; // 24-168 (1-7 days)
}
```

**Returns:**
```typescript
{
  success: boolean;
  link?: string;
  pin?: string;
  error?: string;
}
```

**Side Effects:**
- Generates secure token (UUID)
- Generates 6-digit PIN
- Sends email (if email provided and MailerSend configured)
- Creates audit log entry

**Limits:**
- Max 5 active links per case

---

## Admin Functions

### `createUser(userData)`

**Location:** `app/dashboard/admin/actions.ts`

**Purpose:** Create new user account

**Parameters:**
```typescript
{
  email: string;
  full_name: string;
  role: 'admin' | 'staff';
  temporary_password: string;
}
```

**Returns:**
```typescript
{
  success: boolean;
  error?: string;
}
```

**Side Effects:**
- Creates auth user in Supabase
- Creates profile record
- Sets force_password_change = true
- Creates audit log entry

**Authorization:** Admin only

---

### `updateUser(userId, updates)`

**Location:** `app/dashboard/admin/actions.ts`

**Purpose:** Update user details

**Parameters:**
```typescript
{
  userId: string;
  full_name?: string;
  role?: 'admin' | 'staff';
}
```

**Returns:**
```typescript
{
  success: boolean;
  error?: string;
}
```

**Authorization:** Admin only

---

### `deleteUser(userId)`

**Location:** `app/dashboard/admin/actions.ts`

**Purpose:** Delete user account

**Parameters:**
```typescript
{
  userId: string;
}
```

**Returns:**
```typescript
{
  success: boolean;
  error?: string;
}
```

**Restrictions:**
- Cannot delete self
- Cannot delete last admin

**Side Effects:**
- Deletes auth user
- Deletes profile
- Associated data (cases, notes) retained
- Creates audit log entry

**Authorization:** Admin only

---

### `getAuditLogs(filters)`

**Location:** `app/dashboard/admin/actions.ts`

**Purpose:** Retrieve audit logs

**Parameters:**
```typescript
{
  user_id?: string;
  action?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
}
```

**Returns:**
```typescript
{
  logs: Array<AuditLog>;
  total: number;
}
```

**Authorization:** Admin only

---

### `updateBarangaySettings(settings)`

**Location:** `app/dashboard/settings/actions.ts`

**Purpose:** Update system settings

**Parameters:**
```typescript
{
  province?: string;
  city_municipality?: string;
  barangay_name?: string;
  punong_barangay?: string;
  barangay_secretary?: string;
}
```

**Returns:**
```typescript
{
  success: boolean;
  error?: string;
}
```

**Side Effects:**
- Updates settings record
- Revalidates all pages
- Creates audit log entry

**Authorization:** Admin only

---

### `uploadLogo(type, file)`

**Location:** `app/dashboard/settings/actions.ts`

**Purpose:** Upload barangay or city logo

**Parameters:**
```typescript
{
  type: 'barangay' | 'city';
  file: File; // Image file
}
```

**Returns:**
```typescript
{
  success: boolean;
  url?: string;
  error?: string;
}
```

**File Restrictions:**
- **Max size:** 2MB
- **Allowed types:** JPEG, PNG, WebP
- **Recommended:** 512x512px

**Authorization:** Admin only

---

## API Routes

### Document Download

**Endpoint:** `GET /api/documents/download`

**Purpose:** Generate and download legal documents as PDF

**Query Parameters:**
- `caseId` (required): UUID of the case
- `type` (required): Document type

**Document Types:**
- `summons` - Summons to appear
- `notice` - Notice of Hearing
- `cfa` - Certificate to File Action
- `settlement` - Amicable Settlement
- `referral` - Referral Letter

**Response:**
- **Content-Type:** `application/pdf`
- **Content-Disposition:** `attachment; filename="document-{type}-{caseNumber}.pdf"`

**Example:**
```
GET /api/documents/download?caseId=123e4567-e89b-12d3-a456-426614174000&type=summons
```

**Errors:**
- `400` - Missing or invalid parameters
- `404` - Case not found
- `500` - PDF generation failed

**Authorization:** Requires authenticated session

---

## Error Codes

| Code | Message | Resolution |
|------|---------|------------|
| **AUTH_001** | Invalid credentials | Check email/password |
| **AUTH_002** | Session expired | Re-login required |
| **AUTH_003** | Too many attempts | Wait 15 minutes |
| **AUTH_004** | Unauthorized | Check user role |
| **CASE_001** | Case not found | Verify case ID |
| **CASE_002** | Permission denied | Check user role |
| **CASE_003** | Invalid status transition | Check workflow |
| **FILE_001** | File too large | Reduce file size |
| **FILE_002** | Invalid file type | Use supported formats |
| **FILE_003** | Upload limit exceeded | Delete old files |
| **GUEST_001** | Invalid token | Check link validity |
| **GUEST_002** | Token expired | Request new link |
| **GUEST_003** | Invalid PIN | Check PIN code |
| **GUEST_004** | Too many PIN attempts | Wait 10 minutes |
| **GUEST_005** | Terms not accepted | Accept terms first |
| **DB_001** | Database error | Contact support |
| **MAIL_001** | Email send failed | Check MailerSend config |

---

## Rate Limiting

### Login Attempts
- **Limit:** 5 attempts per 15 minutes
- **Scope:** Per IP address
- **Lockout:** 15 minutes
- **Implementation:** `rate-limiter-flexible`

### Guest PIN Attempts
- **Limit:** 3 attempts per 10 minutes
- **Scope:** Per token
- **Lockout:** 10 minutes
- **Implementation:** `rate-limiter-flexible`

### API Requests
- **No rate limiting** (internal use only)
- All requests require authentication
- RLS policies enforce data access

---

## Type Definitions

### Case

```typescript
interface Case {
  id: string;
  case_number: number;
  title: string;
  status: CaseStatus;
  incident_type: string;
  incident_date: string;
  incident_location: string;
  narrative_facts: string;
  narrative_action: string;
  resolution_details?: ResolutionDetails;
  reported_by: string;
  created_at: string;
  updated_at: string;
}

type CaseStatus = 
  | 'New'
  | 'Under Investigation'
  | 'Hearing Scheduled'
  | 'Settled'
  | 'Dismissed'
  | 'Referred'
  | 'Closed';
```

### Involved Party

```typescript
interface InvolvedParty {
  id: string;
  case_id: string;
  name: string;
  type: 'complainant' | 'respondent' | 'witness';
  contact_number?: string;
  email?: string;
  address?: string;
  created_at: string;
}
```

### Evidence

```typescript
interface Evidence {
  id: string;
  case_id: string;
  file_path: string;
  file_name: string;
  file_type: string;
  description?: string;
  uploaded_by: string;
  guest_link_id?: string;
  is_visible_to_others: boolean;
  created_at: string;
}
```

### Guest Link

```typescript
interface GuestLink {
  id: string;
  case_id: string;
  token: string;
  pin: string;
  recipient_name: string;
  recipient_email?: string;
  recipient_phone?: string;
  created_by: string;
  expires_at: string;
  is_active: boolean;
  terms_accepted_at?: string;
  terms_accepted_ip?: string;
  created_at: string;
}
```

---

## Best Practices

### Error Handling

```typescript
try {
  const result = await someAction(data);
  if (result.error) {
    // Handle error
    toast.error(result.error);
  } else {
    // Handle success
    toast.success('Operation successful');
  }
} catch (error) {
  // Handle unexpected errors
  console.error(error);
  toast.error('An unexpected error occurred');
}
```

### Form Submission

```typescript
'use client';

import { useFormState } from 'react-dom';
import { createCase } from './actions';

export function CaseForm() {
  const [state, formAction] = useFormState(createCase, null);
  
  return (
    <form action={formAction}>
      {/* form fields */}
      {state?.error && <p className="error">{state.error}</p>}
    </form>
  );
}
```

### Optimistic Updates

```typescript
'use client';

import { useOptimistic } from 'react';

export function CaseList({ cases }) {
  const [optimisticCases, addOptimisticCase] = useOptimistic(
    cases,
    (state, newCase) => [...state, newCase]
  );
  
  async function handleCreate(formData) {
    addOptimisticCase({ id: 'temp', ...formData });
    await createCase(formData);
  }
  
  return (
    <div>
      {optimisticCases.map(case => <CaseCard key={case.id} case={case} />)}
    </div>
  );
}
```

---

## Migration Guide

### From REST API to Server Actions

**Before (REST API):**
```typescript
// API route
export async function POST(request: Request) {
  const body = await request.json();
  // ... logic
  return Response.json({ data });
}

// Client
const response = await fetch('/api/cases', {
  method: 'POST',
  body: JSON.stringify(data)
});
const result = await response.json();
```

**After (Server Action):**
```typescript
// Server action
'use server';
export async function createCase(formData: FormData) {
  // ... logic
  return { success: true };
}

// Client
import { createCase } from './actions';
const result = await createCase(formData);
```

**Benefits:**
- ✅ Type-safe
- ✅ No API route needed
- ✅ Automatic serialization
- ✅ Better DX

---

**Last Updated:** December 12, 2025  
**Version:** 1.0.0

*For implementation examples, see [Codebase Structure](./docs/08_CODEBASE_STRUCTURE.md)*
