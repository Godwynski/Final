# ❓ Frequently Asked Questions (FAQ)

Common questions about **BlotterSys** and their answers.

---

## 📋 Table of Contents

- [General Questions](#general-questions)
- [Setup & Installation](#setup--installation)
- [Features & Functionality](#features--functionality)
- [Security & Privacy](#security--privacy)
- [Troubleshooting](#troubleshooting)
- [Support & Contributing](#support--contributing)

---

## General Questions

### What is BlotterSys?

BlotterSys is a modern web application designed to digitize and streamline the Katarungang Pambarangay (barangay justice system) in the Philippines. It replaces traditional paper-based blotter logbooks with a secure, cloud-based platform for managing incident reports, generating legal documents, and tracking case resolutions.

### Who should use BlotterSys?

BlotterSys is designed for:
- **Barangay Captains** - Full system administration
- **Barangay Secretaries** - Administrative oversight
- **Desk Officers** - Daily case management
- **Kagawads** - Case handling and mediation
- **Residents** - Evidence submission via guest portal

### Is BlotterSys free?

Yes, BlotterSys is **open-source software** released under the MIT License. You can use, modify, and distribute it freely. However, you'll need to pay for:
- **Hosting** (Railway, Vercel, or your own server)
- **Supabase** (free tier available, paid for production)
- **MailerSend** (free tier available for email features)

### What makes BlotterSys different from other case management systems?

BlotterSys is specifically designed for Philippine barangay justice:
- ✅ **DILG-compliant** document templates
- ✅ **Katarungang Pambarangay** workflow
- ✅ **Filipino context** (terminology, processes)
- ✅ **Guest portal** for resident participation
- ✅ **Offline-ready** document generation
- ✅ **Open-source** and customizable

### Can I customize BlotterSys for my barangay?

Yes! BlotterSys is highly customizable:
- Modify document templates
- Add custom incident types
- Change branding (logo, colors)
- Adjust workflows
- Add custom fields

See [Contributing Guidelines](./CONTRIBUTING.md) for development guidance.

---

## Setup & Installation

### What are the system requirements?

**Server Requirements:**
- Node.js 20.x or higher
- 1GB RAM minimum (2GB+ recommended)
- 10GB storage minimum
- Internet connection

**Client Requirements:**
- Modern web browser (Chrome 90+, Firefox 90+, Safari 14+, Edge)
- Internet connection
- No special software needed

### How long does setup take?

With our [Quick Start Guide](./QUICK_START.md):
- **First-time setup:** 5-10 minutes
- **With seed data:** +2 minutes
- **Production deployment:** 15-30 minutes

### Do I need coding experience?

**For basic usage:** No coding required
- Login and use the system
- Create cases
- Generate documents
- Upload evidence

**For setup/deployment:** Basic technical knowledge helpful
- Follow step-by-step guides
- Copy/paste commands
- Edit configuration files

**For customization:** Yes, coding experience needed
- TypeScript/JavaScript
- React/Next.js
- SQL for database changes

### What external services do I need?

**Required:**
1. **Supabase** - Database and authentication
   - Free tier: Up to 500MB database, 1GB file storage
   - Paid: $25/month for production use

2. **Hosting** - Railway, Vercel, or self-hosted
   - Railway: $5/month
   - Vercel: Free for hobby, $20/month for production

**Optional:**
3. **MailerSend** - Email delivery for guest links
   - Free tier: 3,000 emails/month
   - Paid: $1 per 1,000 emails

**Total minimum cost:** $0-$5/month (free tiers) or $25-$50/month (production)

### Can I run BlotterSys on my own server?

Yes! You can self-host on:
- **VPS** (DigitalOcean, Linode, AWS EC2)
- **Local server** (for testing only, not recommended for production)
- **Docker** (containerized deployment)

Requirements:
- Linux server (Ubuntu 20.04+ recommended)
- Node.js 20.x
- Nginx or Apache (reverse proxy)
- SSL certificate (Let's Encrypt free)

See [Deployment Guide](./docs/09_DEPLOYMENT.md) for details.

---

## Features & Functionality

### How many cases can the system handle?

BlotterSys can handle:
- **Small barangay:** 100-500 cases/year
- **Medium barangay:** 500-2,000 cases/year
- **Large barangay:** 2,000-10,000 cases/year

Performance depends on your hosting plan. The free Supabase tier supports up to 500MB of data (approximately 5,000-10,000 cases with evidence).

### Can I customize the document templates?

Yes! All document templates are customizable:

**Location:** `components/documents/forms/`
- `SummonsForm.tsx`
- `NoticeOfHearingForm.tsx`
- `CertificateToFileActionForm.tsx`
- `AmicableSettlementForm.tsx`
- `ReferralForm.tsx`

You can modify:
- Text content
- Layout and formatting
- Fields and data
- Branding (logos, headers)

### Does it work offline?

**No, BlotterSys requires an internet connection** for:
- Database access (Supabase)
- Authentication
- File storage
- Email delivery

**However:**
- Generated PDFs can be saved offline
- Documents can be printed
- Data can be exported to CSV

**Offline mode** is on the roadmap (see [Roadmap](./docs/11_ROADMAP.md)).

### Can I export my data?

Yes! You can export:

**Cases:**
- Export to CSV (all cases or filtered)
- Includes case details, parties, status

**Evidence:**
- Download individual files
- Bulk download (manual, via Supabase dashboard)

**Database:**
- Full database backup via Supabase
- SQL dump for migration

**Documents:**
- Download generated PDFs
- Print to PDF

### How do guest links work?

Guest links allow residents to:
1. View their case information
2. Upload evidence (photos, documents)
3. See hearing schedules

**Security features:**
- Time-limited (24-72 hours)
- PIN-protected (6-digit code)
- Single case access only
- Terms acceptance required
- Audit logged

See [Use Case Diagram](./docs/06_USE_CASE.md) for details.

### Can I integrate with other systems?

Currently, BlotterSys is a standalone system. However, you can:
- **Export data** to CSV for use in other systems
- **Use the database** directly (PostgreSQL)
- **Extend with custom code** (open-source)

**Future integrations** (roadmap):
- PNP Blotter System
- LGU Management Systems
- SMS notifications
- Mobile app

---

## Security & Privacy

### Is my data secure?

Yes! BlotterSys implements multiple security layers:

**Authentication:**
- Secure password hashing (bcrypt)
- Session management (JWT)
- Rate limiting (prevents brute force)

**Authorization:**
- Row-Level Security (RLS)
- Role-based access control
- Server-side permission checks

**Data Protection:**
- Encryption in transit (TLS 1.2+)
- Encryption at rest (Supabase)
- Secure file storage
- Audit logging

See [SECURITY.md](./SECURITY.md) for full details.

### Who can access the data?

Access is strictly controlled by role:

**Admin (Barangay Captain/Secretary):**
- Full access to all data
- User management
- System settings
- Audit logs

**Staff (Desk Officer/Kagawad):**
- Case management
- Document generation
- Evidence handling
- No user management

**Guest (Residents):**
- Single case view only
- Own evidence upload only
- Time-limited access
- No system access

See [Scope & Limitations](./docs/02_SCOPE_AND_LIMITATIONS.md) for details.

### Can I delete data?

**Yes, but with restrictions:**

**Cases:**
- Can be deleted by Admin only
- Soft delete (archived, not permanently removed)
- Audit log retained

**Evidence:**
- Can be deleted by uploader or Admin
- Permanent deletion from storage
- Metadata retained in audit log

**Users:**
- Can be deleted by Admin
- Associated data remains (for audit trail)

**Audit Logs:**
- Cannot be deleted (immutable)
- Retained for compliance

### Is BlotterSys GDPR compliant?

BlotterSys has a **GDPR-ready architecture**:
- ✅ Data minimization
- ✅ Purpose limitation
- ✅ Access controls
- ✅ Audit trails
- ✅ Data export capability
- ✅ Right to deletion (with limitations)

**However:**
- You are responsible for compliance
- Consult legal counsel for your jurisdiction
- Philippine Data Privacy Act (DPA) also applies

### How long is data retained?

**Default retention:**
- **Active cases:** Indefinite
- **Closed cases:** Indefinite (for records)
- **Audit logs:** Indefinite (for compliance)
- **Guest links:** Auto-expire after 24-72 hours
- **Sessions:** 7 days (configurable)

**You can configure:**
- Custom retention policies
- Automatic archival
- Data purging schedules

---

## Troubleshooting

### Why can't I login?

**Common causes:**
1. **Invalid credentials** - Check email/password
2. **Account locked** - Too many failed attempts (wait 15 min)
3. **Session expired** - Clear cookies and try again
4. **Supabase down** - Check Supabase status

See [Troubleshooting Guide](./TROUBLESHOOTING.md#authentication-issues) for solutions.

### PDF generation fails - what do I do?

**Common causes:**
1. **Puppeteer not installed** - Reinstall dependencies
2. **Missing Chromium** - Install system dependencies
3. **Memory issues** - Increase server memory
4. **Timeout** - Increase timeout settings

See [Troubleshooting Guide](./TROUBLESHOOTING.md#pdf-generation) for solutions.

### Guest links not sending emails?

**Common causes:**
1. **MailerSend not configured** - Check API key
2. **Email quota exceeded** - Check MailerSend dashboard
3. **Invalid recipient email** - Verify email address
4. **Domain not verified** - Verify sender domain

**Workaround:** Copy guest link manually and send via SMS/messenger

See [Troubleshooting Guide](./TROUBLESHOOTING.md#email--guest-links) for solutions.

### Images not displaying?

**Common causes:**
1. **Image domain not allowed** - Update `next.config.ts`
2. **Storage bucket policy** - Check Supabase storage policies
3. **File path incorrect** - Verify file exists in storage
4. **Browser cache** - Hard refresh (Ctrl+Shift+R)

See [Troubleshooting Guide](./TROUBLESHOOTING.md#file-upload--storage) for solutions.

### System is slow - how to improve performance?

**Quick fixes:**
1. **Clear browser cache**
2. **Check internet connection**
3. **Close unused tabs**
4. **Restart browser**

**Long-term solutions:**
1. **Upgrade hosting plan** - More RAM/CPU
2. **Optimize database** - Add indexes
3. **Enable caching** - Redis/CDN
4. **Compress images** - Reduce file sizes

See [Troubleshooting Guide](./TROUBLESHOOTING.md#performance-issues) for details.

---

## Support & Contributing

### How do I get help?

**Self-service (fastest):**
1. Check this FAQ
2. Read [Troubleshooting Guide](./TROUBLESHOOTING.md)
3. Search [GitHub Issues](https://github.com/yourusername/blottersys/issues)
4. Read [Documentation](./docs/00_INDEX.md)

**Community support:**
1. GitHub Discussions
2. Community forums
3. Social media groups

**Report bugs:**
1. Check if already reported
2. Create GitHub issue
3. Include error messages, steps to reproduce

### Can I request features?

Yes! We welcome feature requests:

1. **Check roadmap** - [Roadmap](./docs/11_ROADMAP.md)
2. **Search existing requests** - GitHub Issues
3. **Create new request** - Use feature request template
4. **Discuss with community** - GitHub Discussions

**Best feature requests include:**
- Clear use case
- Expected behavior
- Why it's needed
- Mockups/examples (if applicable)

### How can I contribute?

We welcome contributions! You can help by:

**Non-technical:**
- Report bugs
- Suggest features
- Improve documentation
- Translate to other languages
- Share with others

**Technical:**
- Fix bugs
- Add features
- Write tests
- Improve performance
- Review pull requests

See [Contributing Guidelines](./CONTRIBUTING.md) for details.

### Is there a demo/test instance?

**Currently:** No public demo available

**You can:**
1. Set up locally (5-10 minutes)
2. Use seed data for testing
3. Deploy your own test instance

**Planned:** Public demo instance (see [Roadmap](./docs/11_ROADMAP.md))

### Where can I find the source code?

**GitHub Repository:** [github.com/yourusername/blottersys](https://github.com/yourusername/blottersys)

**License:** MIT License (free to use, modify, distribute)

### How often is BlotterSys updated?

**Current status:** Active development

**Update frequency:**
- **Bug fixes:** As needed
- **Security patches:** Immediately
- **Features:** Monthly releases
- **Documentation:** Continuous

**Stay updated:**
- Watch GitHub repository
- Check [Changelog](./docs/10_CHANGELOG.md)
- Follow release notes

---

## Still Have Questions?

**Didn't find your answer?**

1. 📖 Check the [full documentation](./docs/00_INDEX.md)
2. 🔍 Search [GitHub Issues](https://github.com/yourusername/blottersys/issues)
3. 💬 Ask in [GitHub Discussions](https://github.com/yourusername/blottersys/discussions)
4. 🐛 [Report a bug](https://github.com/yourusername/blottersys/issues/new)
5. ✨ [Request a feature](https://github.com/yourusername/blottersys/issues/new)

---

**Last Updated:** December 12, 2025  
**Version:** 1.0.0

*This FAQ is maintained by the community. Help us improve it by [contributing](./CONTRIBUTING.md)!*
