# 🚀 Quick Start Guide

Get **BlotterSys** up and running in **5 minutes**!

---

## Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js 20.x** or higher ([Download](https://nodejs.org/))
- ✅ **Git** ([Download](https://git-scm.com/))
- ✅ **Supabase Account** ([Sign up free](https://supabase.com/))
- ✅ **MailerSend Account** (Optional, for email features) ([Sign up free](https://www.mailersend.com/))

---

## 5-Minute Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/blottersys.git
cd blottersys
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages (~2 minutes).

### Step 3: Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.local
```

Now edit `.env.local` with your credentials:

```env
# Required: Get these from https://app.supabase.com/project/YOUR_PROJECT/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Required: Set your app URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional: For guest link emails
MAILERSEND_API_KEY=your_mailersend_key
```

**Where to find Supabase credentials:**
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **Project URL** and **API Keys**

### Step 4: Setup Database

1. Open your Supabase project
2. Go to **SQL Editor**
3. Copy the contents of `supabase/schema.sql`
4. Paste and run in SQL Editor

This creates all necessary tables, policies, and functions.

### Step 5: Create Storage Buckets

Run the bucket creation script:

```bash
node create-buckets.js
```

Or manually create in Supabase:
1. Go to **Storage** in Supabase dashboard
2. Create two buckets:
   - `evidence` (private)
   - `branding` (public)

### Step 6: Seed Sample Data (Optional)

For testing, load sample data:

1. Go to **SQL Editor** in Supabase
2. Copy contents of `supabase/seed_data.sql`
3. Run the script

This creates:
- Sample admin and staff users
- Example cases
- Test data for all features

### Step 7: Start Development Server

```bash
npm run dev
```

The app will start at **http://localhost:3000**

---

## 🎉 You're Ready!

### Default Login Credentials

If you ran the seed data:

**Admin Account:**
- Email: `admin@barangay.local`
- Password: `Admin123!` (change on first login)

**Staff Account:**
- Email: `staff@barangay.local`
- Password: `Staff123!` (change on first login)

### First Steps

1. **Login** at http://localhost:3000/login
2. **Change your password** (required on first login)
3. **Update system settings:**
   - Go to **Settings** → **System**
   - Update barangay name, officials, etc.
4. **Create your first case:**
   - Go to **Cases** → **New Case**
   - Fill in the form and submit

---

## 🔍 Verify Installation

### Check if everything works:

- [ ] Can login successfully
- [ ] Dashboard loads with statistics
- [ ] Can create a new case
- [ ] Can upload evidence
- [ ] Can generate PDF documents
- [ ] Guest links work (if MailerSend configured)

---

## 🐛 Common Issues

### Issue: "Invalid Supabase credentials"
**Solution:** Double-check your `.env.local` file. Make sure:
- No extra spaces in values
- Using the correct project URL
- Using the **anon key** (not service role) for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Issue: "Cannot connect to database"
**Solution:** 
- Verify your Supabase project is active
- Check if you ran the `schema.sql` script
- Ensure RLS policies are enabled

### Issue: "PDF generation fails"
**Solution:**
- On Windows/Mac: Should work out of the box
- On Linux/Docker: See [Deployment Guide](./docs/09_DEPLOYMENT.md) for Puppeteer setup

### Issue: "Guest links not sending"
**Solution:**
- Verify `MAILERSEND_API_KEY` is set in `.env.local`
- Check MailerSend dashboard for errors
- Guest links still work without email (copy link manually)

For more issues, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## 📚 Next Steps

Now that you're set up, explore:

1. **[Technical Background](./docs/03_TECHNICAL_BACKGROUND.md)** - Understand the architecture
2. **[Codebase Structure](./docs/08_CODEBASE_STRUCTURE.md)** - Navigate the code
3. **[Flowcharts](./docs/05_FLOWCHARTS.md)** - Learn the workflows
4. **[Deployment Guide](./docs/09_DEPLOYMENT.md)** - Deploy to production

---

## 🆘 Need Help?

- 📖 Check the [full documentation](./docs/00_INDEX.md)
- 🐛 Report issues on GitHub
- 💬 Join our community discussions

---

## 🎯 Quick Commands Reference

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
node create-buckets.js    # Create storage buckets
node check-buckets.js     # Verify buckets exist

# Utilities
node check-env.ts         # Validate environment variables
```

---

**Estimated Setup Time:** 5-10 minutes  
**Difficulty:** Beginner-friendly

Happy coding! 🎉
