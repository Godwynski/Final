# 🔧 Technical Background

## Technology Stack

### Frontend Technologies

| Category       | Technology     | Version | Purpose                              |
| -------------- | -------------- | ------- | ------------------------------------ |
| **Framework**  | Next.js        | 15.x    | React meta-framework with App Router |
| **Language**   | TypeScript     | 5.6+    | Type-safe JavaScript                 |
| **UI Library** | React          | 19.x    | Component-based UI                   |
| **Styling**    | Tailwind CSS   | 3.4.x   | Utility-first CSS framework          |
| **Components** | Flowbite React | 0.10.x  | Pre-built UI components              |
| **Icons**      | Lucide React   | Latest  | Icon library                         |
| **Charts**     | Recharts       | 2.x     | Data visualization                   |
| **Validation** | Zod            | 3.x     | Schema validation                    |
| **Debouncing** | use-debounce   | 10.x    | Input debouncing                     |

### Backend Technologies

| Category           | Technology            | Version | Purpose                            |
| ------------------ | --------------------- | ------- | ---------------------------------- |
| **Runtime**        | Node.js               | 18+     | JavaScript runtime                 |
| **Database**       | PostgreSQL            | 15+     | Relational database (via Supabase) |
| **Authentication** | Supabase Auth         | Latest  | User authentication & sessions     |
| **Storage**        | Supabase Storage      | Latest  | File upload & storage              |
| **Email**          | MailerSend            | API v1  | Transactional emails               |
| **PDF Generation** | Puppeteer             | 23.x    | Headless Chrome for PDFs           |
| **Rate Limiting**  | rate-limiter-flexible | 5.x     | Request throttling                 |

### Infrastructure

| Component           | Provider         | Purpose                |
| ------------------- | ---------------- | ---------------------- |
| **Hosting**         | Vercel / Railway | Application deployment |
| **Database**        | Supabase Cloud   | PostgreSQL hosting     |
| **Authentication**  | Supabase Auth    | User management        |
| **File Storage**    | Supabase Storage | Evidence file storage  |
| **Email Service**   | MailerSend       | Email delivery         |
| **Version Control** | Git/GitHub       | Source code management |

---

## Architecture Patterns

### Design Patterns

#### React Server Components (RSC)

- **Default Pattern**: Server Components for initial page loads
- **Benefits**: Reduced bundle size, faster initial load, SEO-friendly
- **Use Case**: Dashboard pages, case listings, settings pages

```typescript
// Server Component (default)
export default async function CasesPage() {
    const cases = await getCases() // Server-side data fetching
    return <CasesList cases={cases} />
}
```

#### Client Components

- **Pattern**: Interactive components marked with 'use client'
- **Use Case**: Forms, modals, interactive elements

```typescript
"use client";
import { useState } from "react";

export default function CreateCaseForm() {
  const [formData, setFormData] = useState({});
  // Client-side interactivity
}
```

#### Server Actions

- **Pattern**: Server-side mutations without API routes
- **Benefits**: Type-safe, progressive enhancement, built-in loading states

```typescript
"use server";
export async function createCase(formData: FormData) {
  const data = Object.fromEntries(formData);
  await supabase.from("blotter_cases").insert(data);
}
```

#### Row-Level Security (RLS)

- **Pattern**: Database-level access control
- **Implementation**: PostgreSQL policies on Supabase

```sql
-- Example RLS Policy
CREATE POLICY "Users can view their barangay cases"
ON blotter_cases FOR SELECT
USING (auth.uid() IN (
    SELECT id FROM profiles WHERE barangay_id = blotter_cases.barangay_id
));
```

---

## Security Measures

### Authentication & Authorization

| Measure                   | Implementation    | Details                                      |
| ------------------------- | ----------------- | -------------------------------------------- |
| **Session Management**    | JWT tokens        | Supabase Auth with automatic refresh         |
| **Role-Based Access**     | Database profiles | Admin/Staff roles with different permissions |
| **Password Security**     | Bcrypt hashing    | Handled by Supabase Auth                     |
| **Force Password Change** | Database flag     | `force_password_change` on first login       |

### API Security

| Measure                      | Implementation        | Details                         |
| ---------------------------- | --------------------- | ------------------------------- |
| **Rate Limiting**            | rate-limiter-flexible | 5 login attempts per 15 minutes |
| **CSRF Protection**          | Next.js built-in      | Automatic CSRF token validation |
| **Input Validation**         | Zod schemas           | Client + server-side validation |
| **SQL Injection Prevention** | Parameterized queries | Supabase client auto-escapes    |

### Data Security

| Measure                   | Implementation    | Details                         |
| ------------------------- | ----------------- | ------------------------------- |
| **TLS Encryption**        | HTTPS             | All data in transit encrypted   |
| **File Storage Security** | Private buckets   | RLS policies on storage         |
| **Database Encryption**   | AES-256           | At-rest encryption via Supabase |
| **Audit Logging**         | Database triggers | All critical actions logged     |

### Guest Access Security

| Measure               | Implementation        | Details                         |
| --------------------- | --------------------- | ------------------------------- |
| **Magic Links**       | UUID tokens           | Cryptographically secure tokens |
| **PIN Protection**    | 6-digit codes         | 100000-999999 range             |
| **PIN Rate Limiting** | 3 attempts per 10 min | Prevents brute force            |
| **Link Expiration**   | Configurable          | 1-168 hours (default 24h)       |
| **Auto-Deactivation** | Database trigger      | Links disabled when case closes |
| **Terms Acceptance**  | Required & logged     | Timestamp recorded              |

---

## Performance Optimizations

### Rendering Strategies

| Strategy        | Use Case          | Implementation                  |
| --------------- | ----------------- | ------------------------------- |
| **SSG**         | Landing page      | Static generation at build time |
| **SSR**         | Dashboard pages   | Server-side render per request  |
| **ISR**         | Analytics pages   | Incremental static regeneration |
| **Client-Side** | Interactive forms | Dynamic client rendering        |

### Code Optimization

| Optimization           | Implementation  | Benefit                   |
| ---------------------- | --------------- | ------------------------- |
| **Code Splitting**     | Dynamic imports | Smaller initial bundles   |
| **Tree Shaking**       | ES modules      | Remove unused code        |
| **Lazy Loading**       | next/dynamic    | Load components on demand |
| **Image Optimization** | next/image      | Automatic WebP conversion |

### Database Optimization

| Optimization           | Implementation                 | Benefit                    |
| ---------------------- | ------------------------------ | -------------------------- |
| **Connection Pooling** | Supabase built-in              | Efficient connection reuse |
| **Indexes**            | On foreign keys, search fields | Faster queries             |
| **RPC Functions**      | Complex queries                | Reduce roundtrips          |
| **Pagination**         | Limit/offset queries           | Reduced data transfer      |

---

## Development Environment

### Prerequisites

```bash
# Required Software
- Node.js 18+ (LTS recommended)
- npm 9+ or yarn 1.22+ or pnpm 8+
- Git 2.40+

# Required Accounts
- Supabase Account (free tier available)
- MailerSend Account (free tier: 3,000 emails/month)
```

### Environment Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email Configuration
MAILERSEND_API_KEY=your-mailersend-key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Development Commands

```bash
# Installation
npm install

# Development
npm run dev              # Start dev server (localhost:3000)
npm run build            # Production build
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting errors

# Database
npx supabase login       # Login to Supabase CLI
npx supabase db push     # Push schema changes
npx supabase db pull     # Pull remote schema
```

### Project Structure

```
blottersys/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth group routes
│   │   ├── login/         # Login page
│   │   └── layout.tsx     # Auth layout
│   ├── dashboard/         # Protected routes
│   │   ├── cases/         # Case management
│   │   ├── analytics/     # Analytics dashboard
│   │   ├── admin/         # Admin-only pages
│   │   └── settings/      # Settings pages
│   ├── guest/             # Guest upload portal
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # UI primitives
│   └── shared/           # Shared components
├── lib/                  # Utility functions
├── utils/                # Helper utilities
│   └── supabase/        # Supabase clients
├── public/              # Static assets
├── docs/                # Documentation
└── supabase/            # Database schema & migrations
```

---

## Database Architecture

### Core Tables Structure

```sql
-- User Management
profiles (id, email, full_name, role, barangay_id, created_at)

-- Case Management
blotter_cases (id, case_number, title, incident_type, incident_date, status, created_by, created_at)
involved_parties (id, case_id, name, type, contact_number, email, address)
hearings (id, case_id, hearing_date, hearing_type, status, notes)

-- Evidence Management
evidence (id, case_id, file_path, uploaded_by, is_visible_to_others, created_at)
guest_links (id, case_id, token, pin, guest_name, guest_email, expires_at, status)

-- System Tables
audit_logs (id, user_id, action, details, created_at)
barangay_settings (id, province, city, barangay, punong_barangay, secretary)
site_visits (id, page, user_agent, ip_address, visited_at)
```

### Key Relationships

```
Cases (1) ──→ (N) Parties
Cases (1) ──→ (N) Hearings
Cases (1) ──→ (N) Evidence
Cases (1) ──→ (N) Guest Links
Cases (1) ──→ (N) Audit Logs
```

### Database Functions (RPC)

| Function                         | Purpose              | Returns        |
| -------------------------------- | -------------------- | -------------- |
| `search_cases(query)`            | Full-text search     | Matching cases |
| `search_parties(query)`          | Autocomplete parties | Matching names |
| `get_analytics_charts_dynamic()` | Dashboard data       | Chart datasets |
| `get_audit_logs(filters)`        | Filtered logs        | Audit records  |

---

## API Integrations

### MailerSend Integration

**Purpose**: Transactional email delivery for guest links

**Configuration**:

```typescript
const mailersend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});
```

**Use Cases**:

- Guest link notifications
- Hearing reminders (future)
- Password reset emails (future)

### Supabase Integration

**Services Used**:

1. **Authentication**: User login, sessions, password management
2. **Database**: PostgreSQL with real-time capabilities
3. **Storage**: File uploads for evidence and branding
4. **Edge Functions**: Serverless functions (future use)

**Client Types**:

```typescript
// Server Component Client
const supabase = createClient(); // Uses cookies

// Client Component Client
const supabase = createBrowserClient(); // Uses localStorage

// Admin Client (Service Role)
const supabase = createServiceClient(); // Bypasses RLS
```

### Puppeteer Integration

**Purpose**: Server-side PDF generation for legal documents

**Implementation**:

```typescript
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setContent(htmlTemplate);
const pdf = await page.pdf({ format: "A4" });
```

**Generated Documents**:

- Summons (Initial notification)
- Notice of Hearing
- Amicable Settlement Agreement
- Certificate to File Action

---

## Deployment Considerations

### Vercel Deployment

**Advantages**:

- Zero-config Next.js deployment
- Automatic HTTPS
- Edge network (CDN)
- Serverless functions

**Configuration**:

```json
{
  "build": {
    "env": {
      "PUPPETEER_SKIP_DOWNLOAD": "true"
    }
  }
}
```

### Railway Deployment

**Advantages**:

- Full Node.js environment
- Puppeteer compatibility
- PostgreSQL add-on available
- Docker support

**Dockerfile**:

```dockerfile
FROM node:18-alpine
RUN apk add --no-cache chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
```

### Environment-Specific Configuration

| Environment     | Database       | Email           | Storage          |
| --------------- | -------------- | --------------- | ---------------- |
| **Development** | Supabase Local | MailerSend Test | Local files      |
| **Staging**     | Supabase Cloud | MailerSend Test | Supabase Storage |
| **Production**  | Supabase Cloud | MailerSend Live | Supabase Storage |

---

## Testing Strategy

### Testing Levels

| Level                 | Tools                       | Coverage              |
| --------------------- | --------------------------- | --------------------- |
| **Unit Tests**        | Jest, React Testing Library | Components, utilities |
| **Integration Tests** | Playwright                  | User flows            |
| **E2E Tests**         | Playwright                  | Critical paths        |
| **Manual Testing**    | QA checklist                | Full system           |

### Critical Test Cases

1. ✅ User authentication and authorization
2. ✅ Case creation with validation
3. ✅ File upload and storage
4. ✅ Guest link generation and access
5. ✅ PDF document generation
6. ✅ Rate limiting effectiveness
7. ✅ Database RLS policies

---

## Monitoring & Maintenance

### Logging Strategy

| Log Type             | Storage           | Retention  |
| -------------------- | ----------------- | ---------- |
| **Application Logs** | Vercel/Railway    | 7 days     |
| **Audit Logs**       | Database          | 2 years    |
| **Error Logs**       | Sentry (optional) | 90 days    |
| **Analytics**        | Database          | Indefinite |

### Backup Strategy

| Asset            | Frequency        | Retention  |
| ---------------- | ---------------- | ---------- |
| **Database**     | Daily (Supabase) | 7 days     |
| **File Storage** | Weekly           | 30 days    |
| **Code**         | On commit (Git)  | Indefinite |

---

## Future Enhancements

### Planned Features

1. **Real-time Notifications**: WebSocket updates for case changes
2. **Mobile App**: React Native companion app
3. **SMS Notifications**: Alternative to email via Twilio
4. **Digital Signatures**: E-signature for settlements
5. **Multi-Barangay Support**: Platform for multiple barangays
6. **Advanced Analytics**: Predictive analytics, trends
7. **Document Templates**: Customizable document templates
8. **API Access**: RESTful API for third-party integrations

### Technical Debt

1. Add comprehensive test coverage
2. Implement error boundary components
3. Add internationalization (i18n)
4. Optimize database indexes
5. Implement GraphQL endpoint (optional)
6. Add progressive web app (PWA) support

---

[← Back to Main README](../README.md)
