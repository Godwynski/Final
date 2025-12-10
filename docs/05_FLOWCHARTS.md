# 🔄 System Flowcharts (Role-Based Subprocesses)

Blotter Sys workflows are organized into **4 role-based subprocess flowcharts**. Each subprocess represents a distinct user journey through the system.

| Subprocess       | Actor(s)      | Description                   |
| ---------------- | ------------- | ----------------------------- |
| **Subprocess 1** | All Users     | System Entry & Authentication |
| **Subprocess 2** | Admin Only    | Administrative Functions      |
| **Subprocess 3** | Admin + Staff | Operational Case Management   |
| **Subprocess 4** | Guest Only    | Evidence Upload Portal        |

---

## 🔐 Subprocess 1: System Entry & Authentication

**Actor:** All Users (Admin, Staff, Guest)  
**Purpose:** Entry point for all users - authentication and role-based routing

```mermaid
flowchart TD
    subgraph Entry["SUBPROCESS 1: ENTRY & AUTHENTICATION"]
        Start([User Visits System]) --> Landing[Landing Page]
        Landing --> UserType{User Type?}

        UserType -->|Admin/Staff| LoginPage[Login Page]
        UserType -->|Guest with Link| GuestEntry[Go to Subprocess 4]

        LoginPage --> EnterCreds[Enter Email & Password]
        EnterCreds --> ValidateCreds{Valid Credentials?}

        ValidateCreds -->|No| AttemptsCheck{Attempts >= 5?}
        AttemptsCheck -->|Yes| AccountLocked[Locked 15 min]
        AttemptsCheck -->|No| ShowError[Show Error] --> LoginPage
        AccountLocked --> AccessDenied([Access Denied])

        ValidateCreds -->|Yes| CheckFirstLogin{First Login?}
        CheckFirstLogin -->|Yes| ForcePassword[Force Password Change]
        ForcePassword --> LoadProfile
        CheckFirstLogin -->|No| LoadProfile[Load User Profile]

        LoadProfile --> CheckRole{User Role?}
        CheckRole -->|Admin| AdminDash[Admin Dashboard]
        CheckRole -->|Staff| StaffDash[Staff Dashboard]

        AdminDash --> AdminChoice{Select Path}
        AdminChoice -->|Admin Functions| AdminSub[Go to Subprocess 2]
        AdminChoice -->|Operations| OpsSub[Go to Subprocess 3]

        StaffDash --> StaffSub[Go to Subprocess 3]
    end

    style Start fill:#4CAF50,color:#fff
    style AccessDenied fill:#f44336,color:#fff
    style AdminDash fill:#e3f2fd
    style StaffDash fill:#fff3e0
    style ValidateCreds fill:#ffd93d
    style CheckRole fill:#ffd93d
```

---

## 👑 Subprocess 2: Admin-Only Functions

**Actor:** Admin Only  
**Purpose:** System configuration, user management, and audit functions

```mermaid
flowchart TD
    subgraph Admin["SUBPROCESS 2: ADMIN FUNCTIONS"]
        Start([Admin Dashboard]) --> Menu{Select Function}

        Menu -->|System Settings| Settings[System Settings]
        Menu -->|User Management| Users[User Management]
        Menu -->|Audit Logs| Audit[Audit Logs]
        Menu -->|Return| ReturnOps[Go to Subprocess 3]

        %% System Settings
        Settings --> SettingsAction{Action?}
        SettingsAction -->|Edit Info| EditBarangay[Edit Barangay Info<br/>Province/City/Officials]
        SettingsAction -->|Upload Logo| UploadLogo[Upload Logos<br/>Barangay/City]
        EditBarangay --> SaveSettings[Save Settings]
        UploadLogo --> SaveSettings
        SaveSettings --> SettingsOK[Settings Updated]

        %% User Management
        Users --> UserAction{Action?}
        UserAction -->|Create| CreateUser[Create User<br/>Email/Role/Name]
        UserAction -->|Edit| EditUser[Edit User Details]
        UserAction -->|Delete| DeleteUser[Delete User]
        CreateUser --> UserOK[User Saved]
        EditUser --> UserOK
        DeleteUser --> UserOK

        %% Audit Logs
        Audit --> AuditFilters[Filter by:<br/>Date/User/Action]
        AuditFilters --> ViewLogs[View Audit Trail<br/>Action/User/Timestamp]

        %% End States
        SettingsOK --> End([Return to Dashboard])
        UserOK --> End
        ViewLogs --> End
    end

    style Start fill:#e3f2fd
    style End fill:#2196F3,color:#fff
    style SettingsAction fill:#ffd93d
    style UserAction fill:#ffd93d
```

---

## 📂 Subprocess 3: Operational Case Management

**Actor:** Admin + Staff (Shared)  
**Purpose:** Core case management, document generation, and evidence handling

```mermaid
flowchart TD
    subgraph Operations["SUBPROCESS 3: CASE OPERATIONS"]
        Start([Dashboard]) --> Menu{Select Operation}

        Menu -->|New Case| NewCase[File New Case]
        Menu -->|Manage Cases| ManageCases[Search Cases]
        Menu -->|Documents| Documents[Generate Documents]
        Menu -->|Guest Links| GuestLinks[Create Guest Link]
        Menu -->|Analytics| CaseAnalytics[View Analytics]

        %% NEW CASE FLOW
        NewCase --> CaseForm[Enter Case Details]
        CaseForm --> AddParties[Add Involved Parties<br/>Name Validation Applied]
        AddParties --> ValidateForm{Form Valid?}
        ValidateForm -->|No| ShowErrors[Show Errors] --> CaseForm
        ValidateForm -->|Yes| SaveCase[Save Case<br/>Auto-Generate Case#]
        SaveCase --> CheckPriority{High Priority?<br/>Theft/Injury}
        CheckPriority -->|Yes| NotifyAdmin[Email Admins]
        CheckPriority -->|No| CaseCreated
        NotifyAdmin --> CaseCreated[Case Created]

        %% MANAGE CASES FLOW
        ManageCases --> SearchCase[Search: Case#/Name/Date]
        SearchCase --> ViewCase[View Case Details]
        ViewCase --> CaseAction{Action?}
        CaseAction -->|Update Status| UpdateStatus[Change Status]
        CaseAction -->|Add Note| AddNote[Add Note]
        CaseAction -->|Schedule Hearing| AddHearing[Add Hearing]
        CaseAction -->|View Evidence| ViewEvidence[View Files]

        UpdateStatus --> IsTerminal{Terminal Status?<br/>Settled/Closed/<br/>Dismissed/Referred}
        IsTerminal -->|Yes| LockCase[Lock Case<br/>Deactivate Links]
        IsTerminal -->|No| StatusOK
        LockCase --> LogAudit[Log Audit]
        StatusOK[Updated] --> LogAudit

        AddNote --> NoteOK[Note Saved]
        AddHearing --> HearingOK[Hearing Scheduled]
        ViewEvidence --> ShowFiles[Display Evidence]

        %% DOCUMENT GENERATION
        Documents --> SelectDoc{Document Type?}
        SelectDoc -->|Summons| GenSummons[Generate Summons]
        SelectDoc -->|Notice| GenNotice[Generate Notice]
        SelectDoc -->|Settlement| GenSettlement[Generate Settlement]
        SelectDoc -->|CFA| GenCFA[Generate CFA]
        GenSummons --> RenderPDF[Render PDF]
        GenNotice --> RenderPDF
        GenSettlement --> RenderPDF
        GenCFA --> RenderPDF
        RenderPDF --> DownloadPDF[Download]

        %% GUEST LINKS
        GuestLinks --> EnterRecipient[Enter Recipient:<br/>Name/Email/Phone]
        EnterRecipient --> SetExpiry[Set Expiration<br/>24-72 hours]
        SetExpiry --> GenerateLink[Generate Token + PIN]
        GenerateLink --> SendEmail{Send Email?}
        SendEmail -->|Yes| EmailSent[Email Sent]
        SendEmail -->|Failed| EmailFail[Email Failed]
        EmailSent --> LinkOK[Link Created]

        %% ANALYTICS
        CaseAnalytics --> SetFilters[Set Filters:<br/>Date/Status/Type]
        SetFilters --> FetchStats[Fetch Stats]
        FetchStats --> ShowCharts[Display Charts]

        %% END STATES
        CaseCreated --> End([Return])
        LogAudit --> End
        NoteOK --> End
        HearingOK --> End
        ShowFiles --> End
        DownloadPDF --> End
        LinkOK --> End
        EmailFail --> End
        ShowCharts --> End
    end

    style Start fill:#fff3e0
    style End fill:#2196F3,color:#fff
    style LockCase fill:#ff6b6b,color:#fff
    style ValidateForm fill:#ffd93d
    style IsTerminal fill:#ffd93d
    style SendEmail fill:#ffd93d
```

---

## 👤 Subprocess 4: Guest Evidence Upload Portal

**Actor:** Guest Only (via Magic Link)  
**Purpose:** Secure evidence upload for case-related residents

```mermaid
flowchart TD
    subgraph Guest["SUBPROCESS 4: GUEST PORTAL"]
        Start([Receive Email]) --> ClickLink[Click Magic Link]
        ClickLink --> LoadPortal[Load Guest Portal]

        LoadPortal --> EnterPIN[Enter 6-Digit PIN]
        EnterPIN --> ValidatePIN{PIN Correct?}

        ValidatePIN -->|No| CheckAttempts{Attempts >= 3?}
        CheckAttempts -->|Yes| PINLocked[Locked 10 min]
        CheckAttempts -->|No| EnterPIN
        PINLocked --> Denied([Access Denied])

        ValidatePIN -->|Yes| CheckLink{Link Valid?<br/>Active & Not Expired}
        CheckLink -->|No| LinkExpired[Link Expired]
        LinkExpired --> Denied

        CheckLink -->|Yes| CheckTerms{Terms Already<br/>Accepted?}
        CheckTerms -->|No| ShowTerms[Show Terms & Conditions]
        ShowTerms --> AcceptTerms{Accept?}
        AcceptTerms -->|No| Denied
        AcceptTerms -->|Yes| LogTerms[Log Acceptance<br/>Timestamp + IP]
        LogTerms --> GrantAccess
        CheckTerms -->|Yes| GrantAccess[Access Granted]

        GrantAccess --> ShowCase[Display Case Info:<br/>Narrative<br/>Hearings<br/>Evidence]

        ShowCase --> GuestAction{Action?}
        GuestAction -->|Upload| SelectFile[Select File<br/>JPEG/PNG/WebP]
        GuestAction -->|View| ShowCase
        GuestAction -->|Exit| ExitPortal([Exit])

        SelectFile --> ValidateFile{File Valid?<br/>Type: Image<br/>Size: ≤5MB<br/>Count: ≤5}
        ValidateFile -->|No| FileError[Invalid File]
        FileError --> ShowCase
        ValidateFile -->|Yes| UploadFile[Upload to Storage]
        UploadFile --> SaveRecord[Save Evidence Record]
        SaveRecord --> UploadOK[Upload Success]
        UploadOK --> ShowCase
    end

    style Start fill:#fff3e0
    style Denied fill:#f44336,color:#fff
    style ExitPortal fill:#2196F3,color:#fff
    style ValidatePIN fill:#ffd93d
    style CheckLink fill:#ffd93d
    style AcceptTerms fill:#ffd93d
    style ValidateFile fill:#ffd93d
```

---

## 🔗 Subprocess Connection Map

```
┌───────────────────────────────────────────────────────────────┐
│           SUBPROCESS 1: ENTRY & AUTHENTICATION                │
│                    (All Users Start Here)                     │
└──────────┬────────────────────────────────────┬───────────────┘
           │                                    │
           ▼                                    ▼
┌──────────────────────┐              ┌─────────────────────────┐
│   Role: ADMIN        │              │   Role: GUEST           │
│   ┌──────────────┐   │              │                         │
│   │ SUBPROCESS 2 │   │              │   ┌─────────────────┐   │
│   │ Admin-Only   │   │              │   │ SUBPROCESS 4    │   │
│   │ Functions    │   │              │   │ Guest Portal    │   │
│   └──────┬───────┘   │              │   │ (Evidence Upload)│   │
│          │           │              │   └─────────────────┘   │
│          ▼           │              └─────────────────────────┘
│   ┌──────────────┐   │
│   │ SUBPROCESS 3 │   │       ┌─────────────────────────┐
│   │ Operations   │◄──┼───────│   Role: STAFF           │
│   │ (Shared)     │   │       │                         │
│   └──────────────┘   │       │   ┌─────────────────┐   │
└──────────────────────┘       │   │ SUBPROCESS 3    │   │
                               │   │ Operations      │   │
                               │   │ (Case Mgmt)     │   │
                               │   └─────────────────┘   │
                               └─────────────────────────┘
```

---

## 🔐 Security Checkpoints

Throughout the system, these security measures are enforced:

| Checkpoint                   | Description                         | Enforcement             |
| ---------------------------- | ----------------------------------- | ----------------------- |
| **Login Rate Limiting**      | Max 5 login attempts per 15 minutes | `rate-limiter-flexible` |
| **PIN Rate Limiting**        | Max 3 PIN attempts per 10 minutes   | `rate-limiter-flexible` |
| **Row Level Security (RLS)** | Database-level access control       | Supabase RLS policies   |
| **Session Validation**       | Verify user session on each request | Supabase Auth           |
| **Guest Link Expiration**    | Auto-expire links after duration    | Database trigger        |
| **Case Lock**                | Prevent edits to terminal cases     | Application logic       |
| **Audit Logging**            | Log all critical actions            | Database trigger        |
