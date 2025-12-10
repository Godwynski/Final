# 🔧 Technical Background

## 1. Technology Stack

This section outlines the software development tools, frameworks, and libraries utilized in the development of _BlotterSys_. The selection of these technologies was driven by the requirements for performance, scalability, type safety, and rapid development.

### 1.1 Frontend Technologies

The client-side architecture is built upon a modern React ecosystem, leveraging server-side rendering for optimal performance and SEO.

| Technology       | Version | Role / Justification                                                                                                                                            |
| :--------------- | :------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Next.js**      | 16.0.7  | **Core Framework.** Selected for its App Router architecture, server-side rendering (SSR), and built-in API routes, which unify the frontend and backend logic. |
| **React**        | 19.2.1  | **UI Library.** Provides the component-based architecture. Version 19 introduces improved concurrency and server action support.                                |
| **TypeScript**   | 5.x     | **Language.** Enforces static typing to reduce runtime errors and improve code maintainability for complex logic like case management.                          |
| **Tailwind CSS** | 4.0     | **Styling Engine.** A utility-first CSS framework used for rapid UI development and ensuring consistent design tokens.                                          |
| **Flowbite**     | 4.0.1   | **Component Library.** Provides pre-built, accessible UI components (modals, tables) compatible with Tailwind CSS.                                              |
| **Recharts**     | 3.5.1   | **Data Visualization.** Used for rendering responsive charts in the analytics dashboard.                                                                        |
| **Zod**          | 4.1.13  | **Schema Validation.** Ensures runtime data integrity for form inputs and API request payloads.                                                                 |
| **Lucide React** | 0.555.0 | **Iconography.** A lightweight, consistent icon set used throughout the interface.                                                                              |

### 1.2 Backend Services & Infrastructure

The system employs a serverless and cloud-native approach to minimize infrastructure maintenance while ensuring high availability.

| Technology           | Version | Role / Justification                                                                                                  |
| :------------------- | :------ | :-------------------------------------------------------------------------------------------------------------------- |
| **Node.js**          | 20+     | **Runtime Environment.** Executes JavaScript code on the server side.                                                 |
| **Supabase**         | Cloud   | **Backend-as-a-Service (BaaS).** Provides the PostgreSQL database, authentication system, and object storage.         |
| **PostgreSQL**       | 15+     | **Database.** An advanced, open-source relational database used for structured data storage (cases, users, evidence). |
| **Supabase Auth**    | v2      | **Identity Management.** Handles secure user authentication, session management, and JWT issuance.                    |
| **Supabase Storage** | v2      | **Object Storage.** Securely stores binary large objects (BLOBs) such as evidence photos and PDF documents.           |
| **MailerSend**       | 2.6.0   | **Email Service.** A transactional email API used for sending secure guest links and system notifications.            |
| **Puppeteer**        | 24.32.0 | **PDF Engine.** A headless Chrome Node.js API used to generate high-fidelity PDF legal documents from HTML templates. |

### 1.3 Development & Quality Assurance Tools

| Tool                      | Role                                                                                    |
| :------------------------ | :-------------------------------------------------------------------------------------- |
| **ESLint**                | Static code analysis tool for identifying patterns found in ECMAScript/JavaScript code. |
| **Git**                   | Distributed version control system for tracking changes in source code.                 |
| **Rate-Limiter-Flexible** | Library used to implement DDoS protection and bruteforce prevention on login endpoints. |

---

## 2. Software Architecture

The system follows a **Monolithic implementation within a Serverless environment**, utilizing the **Next.js App Router** pattern. This architecture blends frontend UI and backend logic into a single cohesive codebase while leveraging cloud services for persistence and state.

### 2.1 Architectural Patterns

1.  **Server Components (RSC):**
    - _Description:_ Components that render exclusively on the server.
    - _Usage:_ Used for data fetching (e.g., retrieving case lists) to reduce client-side JavaScript bundles and improve initial page load (FCP).

2.  **Server Actions:**
    - _Description:_ Asynchronous functions executed on the server, callable directly from client components.
    - _Usage:_ Replaces traditional REST API endpoints for form submissions (e.g., `createCase`, `updateStatus`), ensuring type safety and reducing boilerplate.

3.  **Row-Level Security (RLS):**
    - _Description:_ A security pattern where access policies are defined directly on the database tables.
    - _Usage:_ Ensures that users can strictly access only the data permitted by their role (Admin vs. Staff) and tenant (Barangay), regardless of the access vector (API or Dashboard).

---

## 3. Database Schema Design

The persistence layer is built on a **Relational Database Management System (RDBMS)** schema.

### 3.1 Core Entities

- **Profiles**: Extends the auth system with application-specific user data (Roles: Admin/Staff).
- **Blotter_Cases**: The central entity storing incident details, status, and metadata.
- **Involved_Parties**: Stores normalized data about complainants, respondents, and witnesses, linked to cases via Foreign Key.
- **Evidence**: Metadata for files stored in the object storage, linked to specific cases.
- **Guest_Links**: Validates and tracks the temporary access tokens issued to non-system users.

### 3.2 Security Implementation

- **Encryption at Rest**: Data is stored on encrypted volumes.
- **Encryption in Transit**: All connections are enforced via TLS 1.2+.
- **Audit Logging**: Database triggers automatically record `INSERT`, `UPDATE`, and `DELETE` operations into an immutable `audit_logs` table for forensic capability.

---

## 4. External Interfaces

### 4.1 MailerSend API

Restful API integration for delivering transactional emails. It is used primarily for the **Guest Evidence Upload** workflow, delivering time-sensitive "Magic Links" to residents.

### 4.2 Puppeteer Renderer

An internal micro-service abstraction that launches a headless Chromium instance to render HTML/CSS templates into PDF buffers. This ensures that legal documents (Summons, CFA) match exact formatting requirements regardless of the client device.

---

## 5. System Requirements

### 5.1 Deployment Environment

- **Runtime**: Node.js 18.x or higher.
- **Memory**: Minimum 1GB RAM (for Puppeteer PDF generation).
- **Storage**: Ephemeral filesystem support (for temporary file processing).

### 5.2 Client Requirements

- **Browser**: Modern evergreen browser (Chrome 90+, Firefox 90+, Safari 14+, Edge).
- **Network**: Broadband internet connection (required for real-time database connectivity).
