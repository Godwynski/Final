# ⚖️ BlotterSys - Modern Barangay Incident Management

![Status](https://img.shields.io/badge/Status-Active-success)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Supabase](https://img.shields.io/badge/Supabase-Database-green)

**BlotterSys** is a next-generation web application designed to digitize and streamline the justice system at the Barangay level. It replaces traditional logbooks with a secure, cloud-based platform for managing incident reports, generating legal documents, and tracking case resolutions.

---

## 📚 Documentation

For detailed information, please refer to the comprehensive documentation in the `docs/` folder:

| Chapter | Title | Description |
| :--- | :--- | :--- |
| **01** | [**Scope & Limitations**](./docs/02_SCOPE_AND_LIMITATIONS.md) | Functional requirements, user roles, and system boundaries. |
| **02** | [**Technical Background**](./docs/03_TECHNICAL_BACKGROUND.md) | Technology stack, architecture, security measures, and database design. |
| **03** | [**Data Flow**](./docs/04_DATA_FLOW.md) | Visual representation of how data moves through the system. |
| **04** | [**Flowcharts**](./docs/05_FLOWCHARTS.md) | Detailed user journey flows for Auth, Admin, Staff, and Guest roles. |
| **05** | [**Use Case Diagram**](./docs/06_USE_CASE.md) | Actor definitions and feature access matrix. |
| **06** | [**Architecture**](./docs/07_ARCHITECTURE.md) | High-level system architecture and component interactions. |
| **07** | [**Codebase Structure**](./docs/08_CODEBASE_STRUCTURE.md) | Complete breakdown of folders, files, and project organization. |
| **08** | [**Deployment Guide**](./docs/09_DEPLOYMENT.md) | Instructions for deploying to production (Railway/Vercel). |
| **09** | [**Changelog**](./docs/10_CHANGELOG.md) | History of features, updates, and bug fixes. |
| **10** | [**Roadmap**](./docs/11_ROADMAP.md) | Future plans, technical debt, and known issues. |
| **11** | [**FAQ**](./FAQ.md) | Frequently asked questions and answers. |
| **12** | [**Testing Guide**](./TESTING.md) | Manual testing checklists and future automation plans. |
| **13** | [**API Reference**](./docs/API_REFERENCE.md) | Complete server actions and API documentation. |
| **14** | [**Security Policy**](./SECURITY.md) | Security features, best practices, and vulnerability reporting. |

---

## ✨ Key Features

### 📂 Smart Case Management
*   **Digital Blotter**: Full lifecycle management (Filed → Hearing → Resolution).
*   **Real-time Status**: Track progress and deadlines instantly.
*   **Search & Filter**: Powerful retrieval by name, date, or case number.

### 🖨️ Automated Document Generation
*   **One-Click Legal Forms**: Instantly generate DILG-compliant documents:
    *   *Summons*
    *   *Notice of Hearing*
    *   *Certificate to File Action*
*   **PDF Engine**: Professional server-side rendering for consistent print quality.

### 🔐 Secure Evidence Vault
*   **Guest Access**: "Magic Links" allow residents to upload evidence without accounts.
*   **Privacy First**: Time-limited access tokens and PIN verification.
*   **Cloud Storage**: Encrypted storage for photos, videos, and documents.

---

## 🚀 Getting Started

> **⚡ Quick Setup:** New to BlotterSys? Check out our [**5-Minute Quick Start Guide**](./QUICK_START.md) for the fastest way to get up and running!

### Prerequisites
*   Node.js 18+
*   Supabase Project
*   MailerSend Account

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/blottersys.git
    cd blottersys
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create `.env.local` in the root:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
    MAILERSEND_API_KEY=your_mailersend_key
    ```
    *(See [technical docs](./docs/03_TECHNICAL_BACKGROUND.md) for full config)*

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

5.  **View Application**
    Open [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Technology Stack

*   **Framework**: Next.js 16 (App Router)
*   **Database**: Supabase (PostgreSQL)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS 4 + Flowbite
*   **Services**: MailerSend (Email), Puppeteer (PDF)

---

## 🔒 Security

We prioritize data integrity and privacy:
*   **Row-Level Security (RLS)**: Database-enforced access control.
*   **Audit Logging**: Immutable logs for all system actions.
*   **Encryption**: TLS 1.2+ in transit, encrypted at rest.

> *For a deep dive into security implementation, see [Technical Background](./docs/03_TECHNICAL_BACKGROUND.md).*
