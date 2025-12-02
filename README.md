# BlotterSys - Barangay Incident Management System

BlotterSys is a modern, secure, and efficient web application designed to digitize and streamline the management of barangay blotters (incident reports). It empowers local government units to record cases, manage involved parties, generate official documents, and collect digital evidence securely.

![BlotterSys Dashboard](https://placehold.co/1200x600/2563eb/ffffff?text=BlotterSys+Dashboard)

## 🚀 Key Features

-   **Digital Blotter Management**: Create, update, and track incident reports with a comprehensive workflow (New -> Under Investigation -> Hearing -> Settled/Closed).
-   **People Directory**: Maintain a database of complainants, respondents, and witnesses with history tracking.
-   **Smart Alerts**: Automated notifications for stale cases (>15 days idle) and upcoming hearings (<48 hours).
-   **Secure Evidence Upload**: Generate one-time "Magic Links" for residents to upload photos/videos without creating an account.
-   **Document Generation**: Instantly print official forms like Summons, Hearing Notices, and Certificates to File Action.
-   **Role-Based Access Control (RBAC)**:
    -   **Admin**: System oversight, user management, and audit logs.
    -   **Staff**: Day-to-day operations, case management, and reporting.
    -   **Guest**: Restricted access for evidence submission.
-   **Audit Logging**: Immutable logs of all critical system actions for accountability.
-   **Dark Mode Support**: Fully responsive UI with native dark mode.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Flowbite](https://flowbite.com/)
-   **Backend/Database**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage, Realtime)
-   **Icons**: Heroicons / Flowbite Icons

## 🏁 Getting Started

### Prerequisites

-   Node.js 18+
-   npm or yarn
-   A Supabase project

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

3.  **Environment Setup**
    Create a `.env.local` file in the root directory and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  **Open the app**
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 🔒 Security

-   **Row Level Security (RLS)**: All database queries are protected by Supabase RLS policies to ensure users only access data permitted by their role.
-   **Secure Uploads**: Guest upload links are cryptographically signed and time-limited.
-   **Audit Trails**: All sensitive actions are recorded in a tamper-evident audit log table.

## 📄 License

This project is proprietary and intended for use by authorized Local Government Units.
