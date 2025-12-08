# Scope and Limitations of BlotterSys

This document outlines the functional scope and technical limitations of the BlotterSys Barangay Incident Management System. It serves as a reference for users, developers, and stakeholders to understand what the system functionality covers and its operational boundaries.

## 1. System Scope

The system handles the digital management of barangay blotter cases, specifically focusing on the _Katarungang Pambarangay_ process.

### 1.1 Core Functionalities

- **Digital Blotter**: Full lifecycle management of cases from filing to resolution (Filed → Hearing → Amicable Settlement/CFA → Closed).
- **Search & Retrieval**: Advanced filtering of cases by Case Number, Title, Date, Status, or Involved Parties.
- **Dashboard & Analytics**: Real-time visualization of case statistics, status distribution, and incident trends.
- **Audit Trails**: automatic logging of critical system actions (login, status changes, document generation) for accountability.

### 1.2 User Roles & Access Control

- **Admin (Barangay Captain/Secretary)**: Full access to system settings, user management, audit logs, and all operational features.
- **Staff (Desk Officer/Kagawad)**: Operational access to file cases, schedule hearings, managing evidence, and generating documents.
- **Guest (Residents)**: Temporary, secure access to specific case details updates and an evidence upload portal via Magic Links.

### 1.3 Document Handling

- **Automated Generation**: Instant creation of DILG-compliant PDF documents:
  - Summons
  - Notice of Hearing
  - Amicable Settlement
  - Certificate to File Action (CFA)
- **PDF Export**: Documents are rendered server-side and available for download/printing.

### 1.4 Evidence Management

- **Secure Vault**: Encrypted cloud storage for case-related files.
- **Guest Portal**: A specialized, PIN-protected interface allowing non-users (residents) to upload evidence without creating an account.
- **Visibility Control**: Granular control over which evidence files are visible to other parties.

---

## 2. System Limitations

The following constraints define the boundaries of the system's capabilities, determined by technical architecture and configuration.

### 2.1 Technical Constraints

- **Connectivity**: The system is cloud-native and requires an active internet connection to function; there is no offline mode.
- **Platform**: The system is a web application accessible via modern browsers (Chrome, Edge, Firefox, Safari). There is no native mobile application (iOS/Android), though the interface is responsive.
- **Dependencies**: The system relies on third-party services:
  - **Supabase**: For database, authentication, and file storage.
  - **MailerSend**: For sending transactional emails (magic links, notifications).

### 2.2 Storage & Upload Limits

Strict limits are enforced to maintain system performance and storage quotas:

| Feature               | Limit Description                         | Value                                        |
| :-------------------- | :---------------------------------------- | :------------------------------------------- |
| **Guest Upload Size** | Maximum file size for guest uploads       | **5 MB** per file                            |
| **Guest file Count**  | Maximum files a guest can upload per link | **3 files**                                  |
| **Staff Upload Size** | Maximum file size for staff/admin uploads | **10 MB** per file                           |
| **Staff File Count**  | Maximum files staff can attach to a case  | **20 files**                                 |
| **File Types**        | Allowed formats for Evidence              | **JPEG, PNG, WebP** (Images), **PDF** (Docs) |

### 2.3 Operational Constraints

- **Guest Access Duration**: Guest links are temporary. They default to **24 hours** and cannot exceed **7 days**.
- **Guest Link Limit**: A maximum of **5 active guest links** can be generated per case at any one time.
- **Terminal States**: Once a case is marked as _Settled_, _Closed_, _Dismissed_, or _Referred_, it becomes **read-only**. No further edits or uploads are permitted unless reopened.
- **Rate Limiting**:
  - **Login**: Max **5 failed attempts** per 15 minutes.
  - **Guest PIN**: Max **3 failed attempts** per 10 minutes.

### 2.4 Jurisdiction

- **Legal Scope**: The system is designed specifically for the _Katarungang Pambarangay_ law (RA 7160) and is not intended for police blotters or court-level case management.
