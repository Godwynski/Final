# 🔒 Security Policy

Security information and best practices for **BlotterSys**.

---

## 📋 Table of Contents

- [Supported Versions](#supported-versions)
- [Security Features](#security-features)
- [Reporting a Vulnerability](#reporting-a-vulnerability)
- [Security Best Practices](#security-best-practices)
- [Compliance](#compliance)
- [Security Checklist](#security-checklist)

---

## Supported Versions

We provide security updates for the following versions:

| Version | Supported          | End of Support |
| ------- | ------------------ | -------------- |
| 1.x.x   | :white_check_mark: | Active         |
| < 1.0   | :x:                | Unsupported    |

**Recommendation:** Always use the latest stable version for the best security.

---

## Security Features

BlotterSys implements multiple layers of security to protect your data:

### 🔐 Authentication

**Password Security:**
- ✅ Passwords hashed with bcrypt (industry standard)
- ✅ Minimum password requirements enforced
- ✅ Force password change on first login
- ✅ Secure password reset flow

**Session Management:**
- ✅ JWT-based authentication (Supabase Auth)
- ✅ Secure HTTP-only cookies
- ✅ Session expiration (7 days default)
- ✅ Automatic session refresh

**Rate Limiting:**
- ✅ Login attempts: Max 5 per 15 minutes
- ✅ Guest PIN attempts: Max 3 per 10 minutes
- ✅ Prevents brute force attacks

### 🛡️ Authorization

**Role-Based Access Control (RBAC):**
- ✅ Three user roles: Admin, Staff, Guest
- ✅ Server-side permission checks
- ✅ Client-side UI restrictions

**Row-Level Security (RLS):**
- ✅ Database-enforced access control
- ✅ Users can only access their barangay's data
- ✅ Policies defined in SQL
- ✅ Cannot be bypassed by application code

**Permission Matrix:**

| Feature | Admin | Staff | Guest |
|---------|-------|-------|-------|
| View all cases | ✅ | ✅ | ❌ |
| Create cases | ✅ | ✅ | ❌ |
| Edit cases | ✅ | ✅ | ❌ |
| Delete cases | ✅ | ❌ | ❌ |
| Manage users | ✅ | ❌ | ❌ |
| View audit logs | ✅ | ❌ | ❌ |
| Upload evidence | ✅ | ✅ | ✅ |
| View own case | ✅ | ✅ | ✅ |

### 🔒 Data Protection

**Encryption:**
- ✅ **In Transit:** TLS 1.2+ (HTTPS enforced)
- ✅ **At Rest:** AES-256 encryption (Supabase)
- ✅ **Passwords:** bcrypt hashing
- ✅ **Tokens:** Cryptographically secure random generation

**Data Minimization:**
- ✅ Only collect necessary data
- ✅ No sensitive data in logs
- ✅ Automatic data cleanup (expired guest links)

**Audit Logging:**
- ✅ All critical actions logged
- ✅ Immutable audit trail
- ✅ Includes: user, action, timestamp, details
- ✅ Cannot be deleted or modified

### 🛡️ Input Validation

**Server-Side Validation:**
- ✅ Zod schema validation for all inputs
- ✅ Type checking (TypeScript)
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS prevention (sanitized outputs)

**File Upload Security:**
- ✅ File type validation (whitelist)
- ✅ File size limits enforced
- ✅ Virus scanning (recommended for production)
- ✅ Secure file storage (Supabase Storage)

**Allowed File Types:**
- Images: JPEG, PNG, WebP
- Documents: PDF only
- Max size: 10MB (staff), 5MB (guest)

### 🔐 Guest Portal Security

**Multi-Layer Protection:**
1. **Token-based access** - Unique UUID per link
2. **PIN verification** - 6-digit code required
3. **Time-limited** - Links expire (24-72 hours)
4. **Rate limiting** - Max 3 PIN attempts
5. **Terms acceptance** - Required before access
6. **Audit logging** - All actions tracked

**Guest Restrictions:**
- ✅ Single case access only
- ✅ Cannot see other parties' evidence
- ✅ Cannot modify case data
- ✅ Cannot access dashboard
- ✅ Link deactivated when case closed

---

## Reporting a Vulnerability

**We take security seriously.** If you discover a security vulnerability, please follow responsible disclosure:

### ⚠️ DO NOT

- ❌ Report security issues through public GitHub issues
- ❌ Disclose the vulnerability publicly before it's fixed
- ❌ Exploit the vulnerability beyond proof-of-concept

### ✅ DO

1. **Report privately** via one of these methods:
   - Email: security@yourproject.com (preferred)
   - GitHub Security Advisory (private)
   - Direct message to maintainers

2. **Include in your report:**
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Affected versions
   - Suggested fix (if any)
   - Your contact information

3. **Wait for response** before public disclosure

### Response Timeline

| Stage | Timeline |
|-------|----------|
| **Initial Response** | Within 48 hours |
| **Confirmation** | Within 7 days |
| **Status Update** | Weekly |
| **Fix Development** | Depends on severity |
| **Patch Release** | ASAP for critical issues |
| **Public Disclosure** | After patch is released |

### Severity Levels

**Critical (P0):**
- Remote code execution
- Authentication bypass
- Data breach
- **Response:** Immediate (< 24 hours)

**High (P1):**
- Privilege escalation
- SQL injection
- XSS attacks
- **Response:** Within 7 days

**Medium (P2):**
- Information disclosure
- CSRF vulnerabilities
- **Response:** Within 30 days

**Low (P3):**
- Minor security improvements
- **Response:** Next release

---

## Security Best Practices

### For Administrators

#### 1. Strong Passwords

**Requirements:**
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, symbols
- No common words or patterns
- Unique per account

**Tools:**
- Use password manager (1Password, Bitwarden, LastPass)
- Generate random passwords
- Never reuse passwords

#### 2. Access Control

**User Management:**
- ✅ Create users with least privilege
- ✅ Review user access quarterly
- ✅ Remove inactive users promptly
- ✅ Use strong passwords for all accounts
- ✅ Force password change on first login

**Guest Links:**
- ✅ Set shortest expiration needed
- ✅ Deactivate after use
- ✅ Monitor guest uploads
- ✅ Review audit logs regularly

#### 3. Data Backup

**Backup Strategy:**
- ✅ Daily automated backups (Supabase)
- ✅ Weekly manual exports
- ✅ Store backups securely off-site
- ✅ Test restoration quarterly

**What to Backup:**
- Database (all tables)
- File storage (evidence, logos)
- Configuration settings

#### 4. Monitoring

**Regular Checks:**
- ✅ Review audit logs weekly
- ✅ Monitor failed login attempts
- ✅ Check for unusual activity
- ✅ Verify user access levels
- ✅ Review guest link usage

**Red Flags:**
- Multiple failed logins
- Unusual access times
- Large file uploads
- Unexpected user changes

#### 5. Updates

**Keep Software Updated:**
- ✅ Update BlotterSys monthly
- ✅ Apply security patches immediately
- ✅ Update dependencies regularly
- ✅ Monitor security advisories

**Update Process:**
1. Review changelog
2. Test in staging environment
3. Backup production data
4. Deploy during low-traffic period
5. Verify functionality

---

### For Developers

#### 1. Secure Coding

**Never Commit Secrets:**
```bash
# ❌ BAD
SUPABASE_SERVICE_ROLE_KEY=actual_key_here

# ✅ GOOD
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Use Environment Variables:**
```typescript
// ✅ GOOD
const apiKey = process.env.MAILERSEND_API_KEY;

// ❌ BAD
const apiKey = "ms_abc123...";
```

**Check .gitignore:**
```gitignore
.env*
!.env.example
```

#### 2. Input Validation

**Always Validate:**
```typescript
// ✅ GOOD
const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
});

const result = schema.safeParse(data);
if (!result.success) {
  return { error: result.error.message };
}

// ❌ BAD
const email = formData.get('email');
// No validation!
```

**Sanitize Outputs:**
```typescript
// ✅ GOOD - React automatically escapes
<div>{userInput}</div>

// ❌ BAD - Dangerous!
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

#### 3. Database Security

**Use RLS Policies:**
```sql
-- ✅ GOOD
CREATE POLICY "Users can only view their barangay's cases"
ON cases FOR SELECT
USING (auth.uid() IN (
  SELECT id FROM profiles WHERE barangay_id = cases.barangay_id
));

-- ❌ BAD - No RLS policy
```

**Use Parameterized Queries:**
```typescript
// ✅ GOOD
const { data } = await supabase
  .from('cases')
  .select('*')
  .eq('id', caseId);

// ❌ BAD - SQL injection risk
const query = `SELECT * FROM cases WHERE id = '${caseId}'`;
```

#### 4. Authentication

**Check Auth on Every Request:**
```typescript
// ✅ GOOD
export async function serverAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }
  
  // ... rest of logic
}

// ❌ BAD - No auth check
export async function serverAction() {
  // Directly access data without checking auth
}
```

#### 5. File Uploads

**Validate File Types:**
```typescript
// ✅ GOOD
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
if (!allowedTypes.includes(file.type)) {
  return { error: 'Invalid file type' };
}

// ❌ BAD - No validation
```

**Enforce Size Limits:**
```typescript
// ✅ GOOD
const maxSize = 10 * 1024 * 1024; // 10MB
if (file.size > maxSize) {
  return { error: 'File too large' };
}

// ❌ BAD - No size check
```

#### 6. Error Handling

**Don't Expose Sensitive Info:**
```typescript
// ✅ GOOD
catch (error) {
  console.error('Database error:', error);
  return { error: 'An error occurred. Please try again.' };
}

// ❌ BAD - Exposes internal details
catch (error) {
  return { error: error.message }; // May contain SQL, paths, etc.
}
```

---

### For Users

#### 1. Password Security

**Create Strong Passwords:**
- Use password manager
- Minimum 12 characters
- Mix character types
- Unique per account

**Change Passwords:**
- On first login (required)
- If compromised
- Every 90 days (recommended)

#### 2. Session Security

**Logout When Done:**
- Always logout on shared computers
- Don't save passwords in browser
- Clear cookies if suspicious activity

**Recognize Phishing:**
- Verify URL before logging in
- Don't click suspicious links
- Report suspicious emails

#### 3. Data Protection

**Be Careful With:**
- Sensitive case information
- Personal data of parties
- Evidence files

**Don't:**
- Share login credentials
- Email sensitive data
- Use public Wi-Fi without VPN

---

## Compliance

### Data Privacy

**Philippine Data Privacy Act (DPA) Compliance:**
- ✅ Data minimization
- ✅ Purpose limitation
- ✅ Consent management (guest terms)
- ✅ Right to access (data export)
- ✅ Right to deletion (with limitations)
- ✅ Security measures implemented

**GDPR-Ready Architecture:**
- ✅ Data portability (CSV export)
- ✅ Right to be forgotten (user deletion)
- ✅ Audit trails
- ✅ Encryption
- ✅ Access controls

**Note:** You are responsible for ensuring compliance with applicable laws. Consult legal counsel for your jurisdiction.

### Audit Trail

**What's Logged:**
- User logins/logouts
- Case creation/modification
- Status changes
- Evidence uploads/deletions
- User management actions
- Guest link generation
- Document generation

**Log Retention:**
- Indefinite (for compliance)
- Cannot be deleted
- Immutable (cannot be modified)

**Log Access:**
- Admin only
- Searchable and filterable
- Exportable

---

## Security Checklist

### Pre-Deployment

- [ ] All environment variables set correctly
- [ ] `.env.local` not committed to Git
- [ ] HTTPS enforced (production)
- [ ] RLS policies enabled on all tables
- [ ] Rate limiting configured
- [ ] Audit logging enabled
- [ ] File upload limits set
- [ ] CORS configured correctly
- [ ] Security headers set
- [ ] Error messages don't expose sensitive info
- [ ] Default passwords changed
- [ ] Admin account secured

### Post-Deployment

- [ ] Test authentication flow
- [ ] Verify RLS policies work
- [ ] Test file upload restrictions
- [ ] Verify rate limiting works
- [ ] Check audit logs are recording
- [ ] Test guest portal security
- [ ] Verify HTTPS is enforced
- [ ] Test password reset flow
- [ ] Review user permissions
- [ ] Set up monitoring/alerts

### Ongoing Maintenance

- [ ] Review audit logs weekly
- [ ] Update dependencies monthly
- [ ] Apply security patches immediately
- [ ] Review user access quarterly
- [ ] Test backups quarterly
- [ ] Security audit annually
- [ ] Update documentation as needed

---

## Security Resources

### Tools

**Recommended:**
- **Password Manager:** 1Password, Bitwarden
- **2FA:** Google Authenticator, Authy (future)
- **Backup:** Supabase automated backups
- **Monitoring:** Sentry, LogRocket
- **Security Scanning:** OWASP ZAP, Snyk

### Learning

**Security Best Practices:**
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/security)

### Reporting

**Contact:**
- **Security Issues:** security@yourproject.com
- **General Support:** support@yourproject.com
- **GitHub Issues:** For non-security bugs only

---

## Acknowledgments

We thank the security researchers and community members who help keep BlotterSys secure.

**Responsible Disclosure Hall of Fame:**
- (Your name here - report a vulnerability!)

---

**Last Updated:** December 12, 2025  
**Version:** 1.0.0

*Security is everyone's responsibility. Help us keep BlotterSys secure!*
