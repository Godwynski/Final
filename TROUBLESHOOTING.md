# 🔧 Troubleshooting Guide

Common issues and solutions for **BlotterSys**.

---

## 📋 Table of Contents

- [Installation & Setup](#installation--setup)
- [Authentication Issues](#authentication-issues)
- [Database & Supabase](#database--supabase)
- [File Upload & Storage](#file-upload--storage)
- [PDF Generation](#pdf-generation)
- [Email & Guest Links](#email--guest-links)
- [Performance Issues](#performance-issues)
- [Deployment Issues](#deployment-issues)
- [Development Issues](#development-issues)

---

## Installation & Setup

### ❌ "npm install" fails with errors

**Symptoms:**
- Package installation errors
- Dependency conflicts
- Permission errors

**Solutions:**

1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Use correct Node version:**
   ```bash
   node --version  # Should be 20.x or higher
   ```
   If not, install Node.js 20.x from [nodejs.org](https://nodejs.org/)

3. **Check for permission issues (Linux/Mac):**
   ```bash
   sudo chown -R $USER ~/.npm
   ```

### ❌ ".env.local not found" error

**Symptoms:**
- App crashes on startup
- "Missing environment variables" error

**Solutions:**

1. **Create .env.local from template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Verify file exists:**
   ```bash
   ls -la .env.local
   ```

3. **Check file is not in .gitignore:**
   - `.env.local` should be ignored
   - `.env.example` should be committed

---

## Authentication Issues

### ❌ "Invalid login credentials" error

**Symptoms:**
- Cannot login with correct credentials
- "Email or password is incorrect" message

**Solutions:**

1. **Verify user exists in database:**
   - Go to Supabase Dashboard → Authentication → Users
   - Check if user email is listed

2. **Reset password:**
   - Use "Forgot Password" link
   - Or manually reset in Supabase dashboard

3. **Check Supabase credentials in .env.local:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

### ❌ "Session expired" or constant logouts

**Symptoms:**
- Logged out immediately after login
- Session doesn't persist

**Solutions:**

1. **Check cookie settings:**
   - Ensure `NEXT_PUBLIC_SITE_URL` matches your domain
   - For localhost: `http://localhost:3000` (no trailing slash)

2. **Clear browser cookies:**
   - Open DevTools → Application → Cookies
   - Delete all cookies for localhost:3000

3. **Verify middleware configuration:**
   - Check `middleware.ts` is not blocking auth routes

### ❌ "Redirect loop" after login

**Symptoms:**
- Infinite redirects between login and dashboard
- Browser shows "Too many redirects" error

**Solutions:**

1. **Check middleware.ts:**
   - Ensure `/login` is in public routes
   - Verify redirect logic

2. **Clear cookies and cache:**
   ```bash
   # In browser DevTools
   Application → Clear storage → Clear site data
   ```

3. **Verify environment URLs match:**
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

---

## Database & Supabase

### ❌ "Failed to connect to database"

**Symptoms:**
- Cannot fetch data
- "Connection refused" errors
- Timeout errors

**Solutions:**

1. **Verify Supabase project is active:**
   - Go to [Supabase Dashboard](https://app.supabase.com/)
   - Check project status (should be green)

2. **Check database credentials:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   ```

3. **Test connection:**
   ```bash
   node check-env.ts
   ```

### ❌ "Row Level Security policy violation"

**Symptoms:**
- "new row violates row-level security policy" error
- Cannot insert/update data
- Permission denied errors

**Solutions:**

1. **Verify RLS policies are created:**
   - Go to Supabase → Database → Policies
   - Check each table has appropriate policies

2. **Re-run schema.sql:**
   - Copy contents of `supabase/schema.sql`
   - Run in Supabase SQL Editor

3. **Check user role:**
   - Verify user has correct role in `profiles` table
   - Should be 'admin' or 'staff'

### ❌ "Table does not exist" error

**Symptoms:**
- "relation 'cases' does not exist"
- Missing table errors

**Solutions:**

1. **Run database schema:**
   - Go to Supabase → SQL Editor
   - Copy and run `supabase/schema.sql`

2. **Verify tables exist:**
   - Go to Supabase → Table Editor
   - Should see: profiles, cases, involved_parties, evidence, etc.

---

## File Upload & Storage

### ❌ "Failed to upload file" error

**Symptoms:**
- Upload button doesn't work
- "Storage error" messages
- Files don't appear after upload

**Solutions:**

1. **Verify storage buckets exist:**
   ```bash
   node check-buckets.js
   ```

2. **Create buckets if missing:**
   ```bash
   node create-buckets.js
   ```

3. **Check bucket policies:**
   - Go to Supabase → Storage → Policies
   - `evidence` bucket should have upload policies
   - `branding` bucket should be public

### ❌ "File too large" error

**Symptoms:**
- Upload fails for large files
- "File size exceeds limit" message

**Solutions:**

1. **Check file size limits:**
   - Guest uploads: 5 MB per file
   - Staff uploads: 10 MB per file

2. **Compress images before upload:**
   - System automatically compresses on client-side
   - For manual compression, use tools like TinyPNG

3. **Increase Supabase storage limits:**
   - Go to Supabase → Settings → Storage
   - Upgrade plan if needed

### ❌ Images not displaying (showing alt text only)

**Symptoms:**
- Image placeholders instead of actual images
- Alt text visible but no image
- Broken image icons

**Solutions:**

1. **Check next.config.ts image domains:**
   ```typescript
   images: {
     remotePatterns: [
       {
         protocol: 'https',
         hostname: '*.supabase.co',
       },
     ],
   }
   ```

2. **Verify image URLs are correct:**
   - Check browser DevTools → Network tab
   - Look for 403/404 errors on image requests

3. **Restart development server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

---

## PDF Generation

### ❌ "PDF generation failed" error

**Symptoms:**
- Cannot generate documents
- "Puppeteer error" messages
- Blank PDFs

**Solutions:**

1. **Windows/Mac (Development):**
   - Should work out of the box
   - If not, reinstall Puppeteer:
     ```bash
     npm uninstall puppeteer
     npm install puppeteer
     ```

2. **Linux/Docker:**
   - Install Chromium dependencies:
     ```bash
     sudo apt-get install -y \
       chromium-browser \
       fonts-liberation \
       libnss3 \
       libxss1
     ```

3. **Railway/Production:**
   - See [Deployment Guide](./docs/09_DEPLOYMENT.md)
   - Ensure `nixpacks.toml` is configured

### ❌ PDF shows "undefined" or missing data

**Symptoms:**
- PDF generates but shows placeholder text
- Missing case details in document

**Solutions:**

1. **Check case data is complete:**
   - Verify all required fields are filled
   - Check involved parties are added

2. **Clear cache and regenerate:**
   - Refresh the case page
   - Try generating document again

---

## Email & Guest Links

### ❌ Guest link emails not sending

**Symptoms:**
- "Email sent" message but no email received
- MailerSend errors in console

**Solutions:**

1. **Verify MailerSend API key:**
   ```env
   MAILERSEND_API_KEY=your_actual_api_key
   ```

2. **Check MailerSend dashboard:**
   - Go to [MailerSend](https://www.mailersend.com/)
   - Check Activity → Emails
   - Look for errors or bounces

3. **Verify sender email is verified:**
   - MailerSend requires domain verification
   - Add and verify your domain in MailerSend

4. **Manual workaround:**
   - Copy guest link from UI
   - Send manually via any email client

### ❌ "Invalid token" on guest portal

**Symptoms:**
- Guest clicks link but gets "Invalid token" error
- Token expired message

**Solutions:**

1. **Check link expiration:**
   - Default: 24 hours
   - Generate new link if expired

2. **Verify token in database:**
   - Go to Supabase → Table Editor → guest_links
   - Check `is_active` and `expires_at` columns

3. **Check for URL encoding issues:**
   - Ensure full URL is copied (no truncation)
   - Try accessing in incognito mode

### ❌ "Invalid PIN" error for guest

**Symptoms:**
- Correct PIN rejected
- "PIN incorrect" message

**Solutions:**

1. **Verify PIN is 6 digits:**
   - Check email for correct PIN
   - No spaces or special characters

2. **Check rate limiting:**
   - Max 3 attempts per 10 minutes
   - Wait 10 minutes and try again

3. **Generate new guest link:**
   - Old link may be deactivated
   - Create fresh link from dashboard

---

## Performance Issues

### ❌ Slow page load times

**Symptoms:**
- Dashboard takes >5 seconds to load
- Laggy UI interactions

**Solutions:**

1. **Check network tab in DevTools:**
   - Look for slow API calls
   - Check for large image files

2. **Optimize images:**
   - System auto-compresses uploads
   - For existing images, re-upload

3. **Clear browser cache:**
   ```bash
   # In DevTools
   Network → Disable cache
   Application → Clear storage
   ```

4. **Check Supabase performance:**
   - Go to Supabase → Reports
   - Look for slow queries

### ❌ High memory usage

**Symptoms:**
- Browser tab crashes
- "Out of memory" errors

**Solutions:**

1. **Limit concurrent operations:**
   - Don't upload too many files at once
   - Close unused tabs

2. **Check for memory leaks:**
   - Open DevTools → Memory
   - Take heap snapshot
   - Look for detached DOM nodes

---

## Deployment Issues

### ❌ Railway deployment fails

**Symptoms:**
- Build succeeds but app crashes
- "Puppeteer error" in logs

**Solutions:**

1. **Verify nixpacks.toml exists:**
   - Should be in project root
   - Contains Chromium installation

2. **Check environment variables:**
   - All required vars set in Railway dashboard
   - No typos in variable names

3. **Check build logs:**
   - Look for specific error messages
   - Verify Chromium installation succeeded

For detailed deployment help, see [Deployment Guide](./docs/09_DEPLOYMENT.md)

### ❌ Vercel deployment issues

**Symptoms:**
- Build fails on Vercel
- Function timeout errors

**Solutions:**

1. **Increase function timeout:**
   - Go to Vercel project settings
   - Increase timeout to 60s (Pro plan required for >10s)

2. **Use serverless-friendly PDF solution:**
   - Consider `@sparticuz/chromium` instead of Puppeteer
   - Smaller bundle size for serverless

---

## Development Issues

### ❌ "Module not found" errors

**Symptoms:**
- Import errors
- Cannot find module 'xyz'

**Solutions:**

1. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check import paths:**
   - Use `@/` for absolute imports
   - Verify file exists at path

3. **Restart TypeScript server:**
   - VS Code: Cmd/Ctrl + Shift + P → "Restart TS Server"

### ❌ TypeScript errors

**Symptoms:**
- Red squiggly lines
- Type errors in IDE

**Solutions:**

1. **Restart TypeScript server** (see above)

2. **Check tsconfig.json:**
   - Verify paths are correct
   - Ensure all necessary libs are included

3. **Update type definitions:**
   ```bash
   npm update @types/node @types/react @types/react-dom
   ```

### ❌ Hot reload not working

**Symptoms:**
- Changes don't reflect in browser
- Must manually refresh

**Solutions:**

1. **Restart dev server:**
   ```bash
   # Stop with Ctrl+C
   npm run dev
   ```

2. **Check file watcher limits (Linux):**
   ```bash
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

3. **Clear .next cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

---

## 🆘 Still Having Issues?

If none of these solutions work:

1. **Check the logs:**
   - Browser console (F12)
   - Terminal output
   - Supabase logs

2. **Enable debug mode:**
   ```env
   DEBUG=true
   ```

3. **Search existing issues:**
   - Check GitHub issues
   - Search community discussions

4. **Create a new issue:**
   - Include error messages
   - Describe steps to reproduce
   - Share relevant code snippets

5. **Contact support:**
   - For urgent issues
   - Include troubleshooting steps already tried

---

## 📚 Additional Resources

- [Quick Start Guide](./QUICK_START.md)
- [Deployment Guide](./docs/09_DEPLOYMENT.md)
- [Technical Background](./docs/03_TECHNICAL_BACKGROUND.md)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Last Updated:** December 12, 2025  
**Version:** 1.0.0

Found a solution not listed here? Please contribute by submitting a PR!
