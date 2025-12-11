# System Architecture & Codebase Visualization

This document provides a comprehensive visualization of the BlotterSys codebase structure, dependencies, and data flow connections.

---

## 1. High-Level System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Browser["Web Browser"]
    end

    subgraph "Next.js Application"
        subgraph "App Router"
            RootLayout["Root Layout<br/>app/layout.tsx"]

            subgraph "Public Routes"
                LoginPage["Login Page<br/>app/login/page.tsx"]
                ForgotPW["Forgot Password<br/>app/forgot-password/page.tsx"]
                ChangePW["Change Password<br/>app/change-password/page.tsx"]
                LandingPage["Landing Page<br/>app/page.tsx"]
            end

            subgraph "Dashboard Routes"
                DashLayout["Dashboard Layout<br/>app/dashboard/layout.tsx"]
                DashHome["Dashboard Home<br/>app/dashboard/page.tsx"]
                CasesList["Cases List<br/>app/dashboard/cases/page.tsx"]
                CaseDetail["Case Detail<br/>app/dashboard/cases/[id]/page.tsx"]
                NewCase["New Case<br/>app/dashboard/cases/new/page.tsx"]
                AdminUsers["Admin/Users<br/>app/dashboard/admin/page.tsx"]
                Settings["Settings<br/>app/dashboard/settings/page.tsx"]
                People["People Directory<br/>app/dashboard/people/page.tsx"]
            end

            subgraph "Guest Portal"
                GuestPage["Guest Portal<br/>app/guest/[token]/page.tsx"]
                PinForm["PIN Form<br/>pin-form.tsx"]
                GuestUpload["Guest Upload<br/>GuestUploadForm.tsx"]
                GuestEvidence["Guest Evidence<br/>GuestEvidenceList.tsx"]
            end
        end

        subgraph "Components Layer"
            UI["UI Components<br/>components/ui/"]
            Dashboard["Dashboard Components<br/>components/dashboard/"]
            Documents["Document Components<br/>components/documents/"]
            Shared["Shared Components<br/>components/"]
        end

        subgraph "Server Actions"
            DashActions["Dashboard Actions<br/>app/dashboard/actions.ts"]
            CaseActions["Case Actions<br/>app/dashboard/cases/actions.ts"]
            GuestActions["Guest Actions<br/>app/guest/[token]/actions.ts"]
            AuthActions["Auth Actions<br/>app/auth/callback/route.ts"]
        end
    end

    subgraph "Utility Layer"
        SupabaseUtils["Supabase Clients<br/>utils/supabase/"]
        Validation["Validation<br/>utils/validation.ts"]
        DateUtils["Date Utilities<br/>utils/date-formatting.ts"]
        ImageComp["Image Compression<br/>lib/imageCompression.ts"]
    end

    subgraph "Backend Services"
        SupabaseAuth["Supabase Auth"]
        SupabaseDB["Supabase PostgreSQL"]
        SupabaseStorage["Supabase Storage"]
    end

    Browser --> RootLayout
    RootLayout --> LoginPage
    RootLayout --> DashLayout
    RootLayout --> GuestPage

    DashLayout --> DashHome
    DashLayout --> CasesList
    DashLayout --> CaseDetail

    CaseDetail --> CaseActions
    GuestPage --> GuestActions

    CaseActions --> SupabaseUtils
    GuestActions --> SupabaseUtils
    DashActions --> SupabaseUtils

    SupabaseUtils --> SupabaseAuth
    SupabaseUtils --> SupabaseDB
    SupabaseUtils --> SupabaseStorage
```

---

## 2. Directory Structure Overview

```mermaid
graph LR
    subgraph "Root Directory"
        app["app/"]
        components["components/"]
        utils["utils/"]
        lib["lib/"]
        hooks["hooks/"]
        types["types/"]
        constants["constants/"]
        supabase["supabase/"]
        docs["docs/"]
        public["public/"]
    end

    subgraph "app/ Structure"
        app --> app_api["api/"]
        app --> app_auth["auth/"]
        app --> app_dashboard["dashboard/"]
        app --> app_guest["guest/"]
        app --> app_login["login/"]
        app --> app_layout["layout.tsx"]
        app --> app_page["page.tsx"]
    end

    subgraph "components/ Structure"
        components --> comp_ui["ui/"]
        components --> comp_dashboard["dashboard/"]
        components --> comp_documents["documents/"]
        components --> comp_sidebar["sidebar/"]
        components --> comp_shared["Shared Components"]
    end

    subgraph "utils/ Structure"
        utils --> utils_supabase["supabase/"]
        utils --> utils_validation["validation.ts"]
        utils --> utils_auth["auth.ts"]
        utils --> utils_date["date-formatting.ts"]
    end
```

---

## 3. Component Dependency Graph

```mermaid
graph TD
    subgraph "Layout Components"
        RootLayout["app/layout.tsx"]
        DashboardLayout["app/dashboard/layout.tsx"]
        DashboardShell["DashboardShell.tsx"]
    end

    subgraph "Dashboard Shell Dependencies"
        DashboardShell --> Navbar["Navbar.tsx"]
        DashboardShell --> Sidebar["Sidebar.tsx"]
        Sidebar --> SidebarLink["sidebar/SidebarLink.tsx"]
        Sidebar --> SidebarSection["sidebar/SidebarSection.tsx"]
    end

    subgraph "Case Components"
        CaseDetailPage["Case Detail Page"]
        CaseDetailPage --> CaseActionHeader["CaseActionHeader.tsx"]
        CaseDetailPage --> CaseTimeline["CaseTimeline.tsx"]
        CaseDetailPage --> ProceedingsTracker["ProceedingsTracker.tsx"]
        CaseDetailPage --> DashboardEvidenceList["DashboardEvidenceList.tsx"]
        CaseDetailPage --> DashboardEvidenceUploadForm["DashboardEvidenceUploadForm.tsx"]
        CaseDetailPage --> ResolutionBanner["ResolutionBanner.tsx"]
        CaseDetailPage --> StatusStepper["StatusStepper.tsx"]
    end

    subgraph "Document Generation"
        CaseActionHeader --> DocumentPreviewModal["DocumentPreviewModal.tsx"]
        DocumentPreviewModal --> PrintableDocument["PrintableDocument.tsx"]
        DocumentPreviewModal --> PrintButton["PrintButton.tsx"]
        PrintableDocument --> DocTemplates["documents/*.tsx"]
    end

    subgraph "Shared UI Components"
        SearchInput["SearchInput.tsx"]
        FilterDropdown["FilterDropdown.tsx"]
        DateRangePicker["DateRangePicker.tsx"]
        PaginationControls["PaginationControls.tsx"]
        SortableColumn["SortableColumn.tsx"]
        SubmitButton["SubmitButton.tsx"]
        CopyButton["CopyButton.tsx"]
    end

    subgraph "Realtime Components"
        RealtimeNotifications["RealtimeNotifications.tsx"]
        RealtimeListener["RealtimeListener.tsx"]
        NotificationBell["NotificationBell.tsx"]
    end

    RootLayout --> FlowbiteInit["FlowbiteInit.tsx"]
    DashboardLayout --> DashboardShell
    DashboardLayout --> RealtimeNotifications

    CasesList["Cases List Page"] --> SearchInput
    CasesList --> FilterDropdown
    CasesList --> DateRangePicker
    CasesList --> PaginationControls
    CasesList --> SortableColumn
```

---

## 4. Data Flow Architecture

```mermaid
flowchart TB
    subgraph "Client Side"
        User["User Browser"]
        ReactComponents["React Components"]
        ClientState["Client State<br/>useState/useEffect"]
    end

    subgraph "Server Actions"
        SA_Cases["Case Actions<br/>CRUD Operations"]
        SA_Evidence["Evidence Actions<br/>Upload/Delete"]
        SA_Guest["Guest Actions<br/>Token/PIN Verification"]
        SA_Auth["Auth Actions<br/>Login/Logout"]
        SA_Admin["Admin Actions<br/>User Management"]
    end

    subgraph "Supabase Clients"
        ServerClient["Server Client<br/>utils/supabase/server.ts"]
        AdminClient["Admin Client<br/>utils/supabase/admin.ts"]
        Middleware["Middleware Client<br/>utils/supabase/middleware.ts"]
        BrowserClient["Browser Client<br/>utils/supabase/client.ts"]
    end

    subgraph "Supabase Services"
        Auth["Auth Service"]
        Database["PostgreSQL Database"]
        Storage["Storage Buckets<br/>branding, evidence"]
        RealtimeDB["Realtime Subscriptions"]
    end

    subgraph "Database Tables"
        profiles["profiles"]
        cases["cases"]
        involved_parties["involved_parties"]
        evidence["evidence"]
        case_notes["case_notes"]
        hearings["hearings"]
        guest_links["guest_links"]
        audit_logs["audit_logs"]
        notifications["notifications"]
        barangay_settings["barangay_settings"]
    end

    User --> ReactComponents
    ReactComponents --> ClientState
    ReactComponents --> SA_Cases
    ReactComponents --> SA_Evidence
    ReactComponents --> SA_Guest

    SA_Cases --> ServerClient
    SA_Evidence --> ServerClient
    SA_Evidence --> AdminClient
    SA_Guest --> AdminClient
    SA_Auth --> ServerClient
    SA_Admin --> AdminClient

    ServerClient --> Auth
    ServerClient --> Database
    AdminClient --> Database
    AdminClient --> Storage
    BrowserClient --> RealtimeDB

    Database --> cases
    Database --> profiles
    Database --> evidence
    Database --> hearings
    Database --> guest_links

    Storage --> EvidenceBucket["Evidence Files"]
    Storage --> BrandingBucket["Branding Images"]
```

---

## 5. Database Entity Relationship

```mermaid
erDiagram
    profiles ||--o{ cases : "reported_by"
    profiles ||--o{ case_notes : "created_by"
    profiles ||--o{ evidence : "uploaded_by"
    profiles ||--o{ guest_links : "created_by"
    profiles ||--o{ audit_logs : "user_id"
    profiles ||--o{ notifications : "user_id"

    cases ||--o{ involved_parties : "case_id"
    cases ||--o{ case_notes : "case_id"
    cases ||--o{ evidence : "case_id"
    cases ||--o{ hearings : "case_id"
    cases ||--o{ guest_links : "case_id"
    cases ||--o{ audit_logs : "case_id"

    guest_links ||--o{ evidence : "guest_link_id"

    profiles {
        uuid id PK
        text email
        text full_name
        text role
        boolean force_password_change
        timestamp created_at
    }

    cases {
        uuid id PK
        serial case_number
        text title
        case_status status
        incident_type incident_type
        timestamp incident_date
        text incident_location
        text narrative_facts
        text narrative_action
        jsonb resolution_details
        uuid reported_by FK
        timestamp created_at
        timestamp updated_at
    }

    involved_parties {
        uuid id PK
        uuid case_id FK
        text name
        party_type type
        text contact_number
        text email
        text address
        timestamp created_at
    }

    evidence {
        uuid id PK
        uuid case_id FK
        text file_path
        text file_name
        text file_type
        text description
        uuid uploaded_by FK
        uuid guest_link_id FK
        boolean is_visible_to_others
        timestamp created_at
    }

    hearings {
        uuid id PK
        uuid case_id FK
        timestamp hearing_date
        text hearing_type
        text status
        text notes
        timestamp created_at
    }

    guest_links {
        uuid id PK
        uuid case_id FK
        text token
        text pin
        uuid created_by FK
        timestamp expires_at
        boolean is_active
        text recipient_name
        timestamp created_at
    }

    case_notes {
        uuid id PK
        uuid case_id FK
        text content
        uuid created_by FK
        timestamp created_at
    }

    audit_logs {
        uuid id PK
        uuid user_id FK
        uuid case_id FK
        text action
        jsonb details
        timestamp created_at
    }

    notifications {
        uuid id PK
        uuid user_id FK
        text title
        text message
        text link
        boolean is_read
        timestamp created_at
    }

    barangay_settings {
        uuid id PK
        text province
        text city_municipality
        text barangay_name
        text punong_barangay
        text barangay_secretary
        text logo_barangay_url
        text logo_city_url
        timestamp updated_at
    }
```

---

## 6. Authentication & Authorization Flow

```mermaid
sequenceDiagram
    participant U as User
    participant B as Browser
    participant M as Middleware
    participant A as Auth Route
    participant S as Supabase Auth
    participant D as Dashboard

    rect rgb(240, 248, 255)
        Note over U,D: Login Flow
        U->>B: Navigate to /login
        B->>M: Request /login
        M->>B: Allow (public route)
        B->>U: Show login form
        U->>B: Submit credentials
        B->>A: POST /auth/callback
        A->>S: signInWithPassword()
        S-->>A: Session token
        A-->>B: Set cookies, redirect
        B->>D: Navigate to /dashboard
    end

    rect rgb(255, 248, 240)
        Note over U,D: Protected Route Access
        U->>B: Navigate to /dashboard
        B->>M: Request /dashboard
        M->>S: Validate session
        S-->>M: Session valid
        M->>D: Allow access
        D-->>B: Render dashboard
    end

    rect rgb(240, 255, 240)
        Note over U,D: Guest Portal Flow
        U->>B: Navigate to /guest/[token]
        B->>M: Request guest route
        M->>B: Allow (guest route exemption)
        B->>U: Show PIN entry form
        U->>B: Submit PIN
        B->>A: verifyGuestPin()
        A->>S: Validate token + PIN
        S-->>A: Guest link data
        A-->>B: Set guest cookie
        B->>U: Show evidence upload portal
    end
```

---

## 7. Case Lifecycle State Machine

```mermaid
stateDiagram-v2
    [*] --> New: Case Created

    New --> UnderInvestigation: Start Investigation
    New --> Dismissed: Dismiss Case
    New --> Referred: Refer to Agency

    UnderInvestigation --> HearingScheduled: Schedule Hearing
    UnderInvestigation --> Dismissed: Dismiss Case
    UnderInvestigation --> Referred: Refer to Agency

    HearingScheduled --> Settled: Resolution Reached
    HearingScheduled --> HearingScheduled: Reschedule
    HearingScheduled --> UnderInvestigation: Back to Investigation
    HearingScheduled --> Dismissed: Dismiss Case
    HearingScheduled --> Referred: Refer to Agency

    Settled --> Closed: Finalize Case
    Dismissed --> [*]
    Referred --> [*]
    Closed --> [*]

    note right of New
        Initial state when
        case is filed
    end note

    note right of HearingScheduled
        Mediation, Conciliation,
        or Arbitration
    end note

    note right of Settled
        Agreement between
        parties reached
    end note
```

---

## 8. File Import Dependency Map

```mermaid
graph LR
    subgraph "Entry Points"
        AppLayout["app/layout.tsx"]
        DashLayout["app/dashboard/layout.tsx"]
        GuestPage["app/guest/[token]/page.tsx"]
    end

    subgraph "Core Utilities"
        ServerClient["utils/supabase/server.ts"]
        AdminClient["utils/supabase/admin.ts"]
        Validation["utils/validation.ts"]
        Config["constants/config.ts"]
    end

    subgraph "Actions"
        DashActions["dashboard/actions.ts"]
        CaseActions["cases/actions.ts"]
        CaseIdActions["cases/[id]/actions.ts"]
        GuestActions["guest/[token]/actions.ts"]
        SettingsActions["settings/actions.ts"]
    end

    subgraph "Components"
        DashShell["DashboardShell"]
        Navbar["Navbar"]
        Sidebar["Sidebar"]
        CaseHeader["CaseActionHeader"]
        EvidenceList["EvidenceList"]
        Timeline["CaseTimeline"]
    end

    %% Layout Dependencies
    AppLayout --> FlowbiteInit
    AppLayout --> Toaster
    DashLayout --> ServerClient
    DashLayout --> DashShell
    DashLayout --> DashActions

    %% Shell Dependencies
    DashShell --> Navbar
    DashShell --> Sidebar

    %% Action Dependencies
    DashActions --> ServerClient
    DashActions --> AdminClient
    CaseActions --> ServerClient
    CaseIdActions --> ServerClient
    CaseIdActions --> AdminClient
    CaseIdActions --> Validation
    GuestActions --> AdminClient
    GuestActions --> Config

    %% Component Dependencies
    CaseHeader --> ServerClient
    EvidenceList --> ImageLightbox
    GuestPage --> GuestActions
    GuestPage --> PinForm
    GuestPage --> GuestUpload
    GuestPage --> GuestEvidence
```

---

## 9. API Routes & Server Actions Summary

| Category            | File                                  | Key Functions                                                                        |
| ------------------- | ------------------------------------- | ------------------------------------------------------------------------------------ |
| **Dashboard**       | `app/dashboard/actions.ts`            | `getCachedProfile`, `getCachedNewCasesCount`, `getActionRequiredCases`               |
| **Cases**           | `app/dashboard/cases/actions.ts`      | `searchCases`, `exportCasesToCSV`                                                    |
| **Case Detail**     | `app/dashboard/cases/[id]/actions.ts` | `updateCaseStatus`, `addNote`, `uploadEvidence`, `deleteEvidence`, `createGuestLink` |
| **Case Workflow**   | `app/dashboard/cases/workflow.ts`     | `resolveCase`, `dismissCase`, `referCase`                                            |
| **Guest Portal**    | `app/guest/[token]/actions.ts`        | `verifyGuestPin`, `uploadGuestEvidence`, `deleteGuestEvidence`                       |
| **Settings**        | `app/dashboard/settings/actions.ts`   | `updateBarangaySettings`, `uploadLogo`                                               |
| **Admin**           | `app/dashboard/admin/actions.ts`      | `createUser`, `updateUser`, `deleteUser`                                             |
| **Auth**            | `app/auth/callback/route.ts`          | OAuth callback handler                                                               |
| **Password**        | `app/change-password/actions.ts`      | `changePassword`                                                                     |
| **Forgot Password** | `app/forgot-password/actions.ts`      | `forgotPassword`                                                                     |

---

## 10. Technology Stack Visualization

```mermaid
graph TB
    subgraph "Frontend"
        Next["Next.js 16"]
        React["React 19"]
        TW["Tailwind CSS 4"]
        Flowbite["Flowbite UI"]
        Lucide["Lucide Icons"]
        Recharts["Recharts"]
        Sonner["Sonner Toasts"]
    end

    subgraph "Backend"
        NextAPI["Next.js Server Actions"]
        SupabaseSSR["Supabase SSR"]
        SupabaseJS["Supabase JS"]
    end

    subgraph "Database & Storage"
        PostgreSQL["PostgreSQL"]
        SupabaseAuth["Auth Service"]
        SupabaseStorage["Storage Buckets"]
        SupabaseRealtime["Realtime"]
    end

    subgraph "Utilities"
        Zod["Zod Validation"]
        RateLimiter["Rate Limiter Flexible"]
        MailerSend["MailerSend"]
        UseDebounce["use-debounce"]
    end

    subgraph "Development"
        TypeScript["TypeScript 5"]
        ESLint["ESLint 9"]
        PostCSS["PostCSS"]
    end

    Next --> React
    React --> TW
    TW --> Flowbite
    Next --> NextAPI
    NextAPI --> SupabaseSSR
    SupabaseSSR --> SupabaseJS
    SupabaseJS --> PostgreSQL
    SupabaseJS --> SupabaseAuth
    SupabaseJS --> SupabaseStorage
    SupabaseJS --> SupabaseRealtime
```

---

## Quick Reference: Key File Locations

| Purpose               | Location                   |
| --------------------- | -------------------------- |
| **Root Layout**       | `app/layout.tsx`           |
| **Dashboard Layout**  | `app/dashboard/layout.tsx` |
| **Case Management**   | `app/dashboard/cases/`     |
| **Guest Portal**      | `app/guest/[token]/`       |
| **Supabase Clients**  | `utils/supabase/`          |
| **Type Definitions**  | `types/index.ts`           |
| **Configuration**     | `constants/config.ts`      |
| **Database Schema**   | `supabase/schema.sql`      |
| **Shared Components** | `components/`              |
| **Custom Hooks**      | `hooks/`                   |
| **Image Utils**       | `lib/imageCompression.ts`  |
| **Validation**        | `utils/validation.ts`      |

---

> **Note:** These diagrams are created with Mermaid.js for easy version control and documentation updates. To view them properly, use a Markdown viewer that supports Mermaid diagrams (GitHub, VS Code with extension, etc.).
