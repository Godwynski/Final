# ⚖️ BlotterSys - Modern Barangay Incident Management

![Status](https://img.shields.io/badge/Status-Active-success)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Supabase](https://img.shields.io/badge/Supabase-Database-green)

**BlotterSys** is a next-generation web application designed to digitize and streamline the justice system at the Barangay level. It replaces traditional logbooks with a secure, cloud-based platform for managing incident reports, generating legal documents, and tracking case resolutions.

## ✨ Key Features

### 📂 Smart Case Management
- **Digital Blotter**: Record and track incidents with a structured workflow (Filed -> Hearing -> Amicable Settlement -> Certificate to File Action).
- **Real-time Updates**: Live status tracking for complainants and respondents.
- **Search & Filter**: Instantly retrieve cases by case number, name, or date.

### 🖨️ Automated Document Generation
- **One-Click Printing**: Generate official DILG-compliant forms instantly:
  - *Summons*
  - *Notice of Hearing*
  - *Amicable Settlement*
  - *Certificate to File Action*
- **PDF Export**: Download documents for offline archiving.

### 🔐 Secure Evidence Vault
- **Magic Links**: Send time-limited, secure upload links to residents via email.
- **Guest Uploads**: Residents can upload photos/videos without creating an account.
- **Bank-Grade Security**: All evidence is encrypted and stored securely via Supabase Storage.

### 📊 Analytics Dashboard
- **Insightful Metrics**: Track case volume, resolution rates, and common incident types.
- **Visual Reports**: Interactive charts powered by Recharts.

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Email Service**: [MailerSend](https://www.mailersend.com/)
- **UI Components**: [Flowbite](https://flowbite.com/) & [Lucide React](https://lucide.dev/)
- **Validation**: [Zod](https://zod.dev/)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- A Supabase project
- A MailerSend account (for email notifications)

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
    Create a `.env.local` file in the root directory and add the following keys:

    ```env
    # Supabase Configuration
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    
    # MailerSend Configuration (for Guest Links)
    MAILERSEND_API_KEY=your_mailersend_api_key
    MAILERSEND_FROM_EMAIL=noreply@yourdomain.com
    MAILERSEND_FROM_NAME="BlotterSys Notification"
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  **Access the Application**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```
├── app/                # Next.js App Router pages and API routes
│   ├── api/            # Backend API endpoints
│   ├── dashboard/      # Protected dashboard views
│   └── guest/          # Public-facing guest upload pages
├── components/         # Reusable UI components
├── lib/                # Library configurations (Supabase, Utils)
├── supabase/           # Database schema and migrations
├── types/              # TypeScript type definitions
└── utils/              # Helper functions
```

## 🔒 Security & Privacy

- **Row Level Security (RLS)**: Strictly enforces data access policies at the database level.
- **Audit Logging**: Every action (create, update, delete) is logged for accountability.
- **Data Encryption**: Sensitive data is encrypted in transit and at rest.

## 📄 License

This project is proprietary software developed for Local Government Units. Unauthorized reproduction or distribution is strictly prohibited.

---
© 2025 BlotterSys™ Inc. All Rights Reserved.
