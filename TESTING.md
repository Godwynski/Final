# 🧪 Testing Guide

Comprehensive testing documentation for **BlotterSys**.

---

## 📋 Table of Contents

- [Testing Strategy](#testing-strategy)
- [Current Test Coverage](#current-test-coverage)
- [Manual Testing](#manual-testing)
- [Test Scenarios](#test-scenarios)
- [Future: Automated Testing](#future-automated-testing)
- [Performance Testing](#performance-testing)
- [Security Testing](#security-testing)

---

## Testing Strategy

BlotterSys uses a **multi-layered testing approach** to ensure quality and reliability:

### 1. Manual Testing (Current)
- **UI/UX validation** - User interface and experience
- **Functional testing** - Feature correctness
- **Integration testing** - Component interactions
- **User acceptance testing** - Real-world scenarios

### 2. Automated Testing (Planned)
- **Unit tests** - Individual functions and components
- **Integration tests** - API and database interactions
- **End-to-End tests** - Complete user workflows
- **Visual regression tests** - UI consistency

### 3. Continuous Testing
- **Pre-commit checks** - Linting and type checking
- **Pre-deployment** - Full test suite
- **Post-deployment** - Smoke tests
- **Monitoring** - Error tracking and performance

---

## Current Test Coverage

| Test Type | Coverage | Status |
|-----------|----------|--------|
| **Manual Testing** | 100% | ✅ Active |
| **Unit Tests** | 0% | ⏳ Planned |
| **Integration Tests** | 0% | ⏳ Planned |
| **E2E Tests** | 0% | ⏳ Planned |
| **Performance Tests** | Manual | ⚠️ Ad-hoc |
| **Security Tests** | Manual | ⚠️ Ad-hoc |

**Target Coverage (Future):**
- Unit tests: 80%+
- Integration tests: 70%+
- E2E tests: Critical paths (100%)

---

## Manual Testing

### Pre-Deployment Checklist

Before deploying to production, verify all items:

#### ✅ Authentication & Authorization

- [ ] **Login**
  - [ ] Valid credentials login successfully
  - [ ] Invalid credentials show error
  - [ ] Rate limiting works (5 attempts/15 min)
  - [ ] Session persists across page refreshes
  - [ ] Logout clears session

- [ ] **Password Management**
  - [ ] First login forces password change
  - [ ] Password requirements enforced
  - [ ] Forgot password sends email
  - [ ] Password reset link works
  - [ ] Old password invalidated after reset

- [ ] **Role-Based Access**
  - [ ] Admin can access all features
  - [ ] Staff cannot access admin panel
  - [ ] Guest cannot access dashboard
  - [ ] Unauthorized access redirects to login

#### ✅ Case Management

- [ ] **Create Case**
  - [ ] Form validation works
  - [ ] Required fields enforced
  - [ ] Case number auto-generates
  - [ ] Involved parties can be added
  - [ ] Custom incident type ("Other") works
  - [ ] Name validation prevents invalid inputs
  - [ ] Case saves successfully

- [ ] **View Case**
  - [ ] Case details display correctly
  - [ ] All tabs load (Overview, Parties, Hearings, Evidence, Notes, Documents)
  - [ ] Status badge shows correct color
  - [ ] Timeline displays events
  - [ ] Proceedings tracker shows progress

- [ ] **Edit Case**
  - [ ] Can update case details
  - [ ] Can add/remove parties
  - [ ] Can update status
  - [ ] Changes save correctly
  - [ ] Audit log records changes

- [ ] **Delete Case**
  - [ ] Confirmation modal appears
  - [ ] Case deleted successfully
  - [ ] Associated data handled correctly
  - [ ] Audit log records deletion

- [ ] **Search & Filter**
  - [ ] Search by case number works
  - [ ] Search by title works
  - [ ] Search by party name works
  - [ ] Filter by status works
  - [ ] Filter by incident type works
  - [ ] Date range filter works
  - [ ] Pagination works
  - [ ] Sort by columns works

#### ✅ Document Generation

- [ ] **Summons**
  - [ ] Generates correctly
  - [ ] All data populates
  - [ ] PDF downloads
  - [ ] Format is correct
  - [ ] Barangay logo displays

- [ ] **Notice of Hearing**
  - [ ] Generates correctly
  - [ ] Hearing date/time correct
  - [ ] All parties listed
  - [ ] PDF downloads

- [ ] **Certificate to File Action (CFA)**
  - [ ] Generates correctly
  - [ ] Mediation attempts documented
  - [ ] Reason for failure stated
  - [ ] PDF downloads

- [ ] **Amicable Settlement**
  - [ ] Generates correctly
  - [ ] Agreement terms displayed
  - [ ] Signatures section present
  - [ ] PDF downloads

- [ ] **Referral Letter**
  - [ ] Generates correctly
  - [ ] Referral agency correct
  - [ ] Case summary included
  - [ ] PDF downloads

#### ✅ Evidence Management

- [ ] **Staff Upload**
  - [ ] Can select files
  - [ ] File type validation works
  - [ ] File size limit enforced (10MB)
  - [ ] Multiple files can be uploaded
  - [ ] Upload progress shows
  - [ ] Files appear in evidence list
  - [ ] Thumbnails display for images

- [ ] **Guest Upload**
  - [ ] Guest link generates
  - [ ] Email sends (if configured)
  - [ ] Link is accessible
  - [ ] PIN verification works
  - [ ] Terms acceptance required
  - [ ] File upload works
  - [ ] File size limit enforced (5MB)
  - [ ] Max 3 files enforced
  - [ ] Files appear in evidence list

- [ ] **Evidence Display**
  - [ ] Images display correctly
  - [ ] Lightbox works for images
  - [ ] PDFs can be downloaded
  - [ ] File metadata shows
  - [ ] Uploaded by info correct
  - [ ] Visibility toggle works

- [ ] **Evidence Deletion**
  - [ ] Confirmation required
  - [ ] File deleted from storage
  - [ ] Metadata removed
  - [ ] Audit log records deletion

#### ✅ Guest Portal

- [ ] **Access**
  - [ ] Link is accessible
  - [ ] PIN entry required
  - [ ] Invalid PIN shows error
  - [ ] Rate limiting works (3 attempts/10 min)
  - [ ] Expired link shows error
  - [ ] Inactive link shows error

- [ ] **Terms & Conditions**
  - [ ] Terms modal displays
  - [ ] Must accept to proceed
  - [ ] Acceptance logged with IP/timestamp
  - [ ] Can view terms again

- [ ] **Case View**
  - [ ] Case narrative displays
  - [ ] Hearing schedule shows
  - [ ] Evidence list displays
  - [ ] Can view own uploads
  - [ ] Cannot see other parties' evidence (if hidden)

- [ ] **Upload**
  - [ ] File selection works
  - [ ] Image compression works
  - [ ] Upload progress shows
  - [ ] Success message displays
  - [ ] File appears in list immediately

#### ✅ Dashboard & Analytics

- [ ] **Statistics**
  - [ ] Total cases count correct
  - [ ] Status breakdown correct
  - [ ] Charts render correctly
  - [ ] Data updates in real-time

- [ ] **Calendar**
  - [ ] Hearings display on correct dates
  - [ ] Can navigate months
  - [ ] Click hearing shows details
  - [ ] Today is highlighted

- [ ] **Recent Cases**
  - [ ] Shows latest cases
  - [ ] Correct sorting
  - [ ] Links work
  - [ ] Status badges correct

- [ ] **Action Required**
  - [ ] Shows cases needing attention
  - [ ] Priority indicators work
  - [ ] Links work

#### ✅ Admin Functions

- [ ] **User Management**
  - [ ] Can create users
  - [ ] Email validation works
  - [ ] Role assignment works
  - [ ] Can edit users
  - [ ] Can delete users
  - [ ] Cannot delete self
  - [ ] Password reset works

- [ ] **System Settings**
  - [ ] Can update barangay info
  - [ ] Can upload logos
  - [ ] Changes save correctly
  - [ ] Changes reflect in documents

- [ ] **Audit Logs**
  - [ ] Logs display correctly
  - [ ] Can filter by date
  - [ ] Can filter by user
  - [ ] Can filter by action
  - [ ] Export works

#### ✅ Responsive Design

- [ ] **Mobile (< 768px)**
  - [ ] Navigation menu works
  - [ ] Forms are usable
  - [ ] Tables scroll horizontally
  - [ ] Buttons are tappable
  - [ ] Images scale correctly

- [ ] **Tablet (768px - 1024px)**
  - [ ] Layout adapts correctly
  - [ ] Sidebar behavior correct
  - [ ] All features accessible

- [ ] **Desktop (> 1024px)**
  - [ ] Full layout displays
  - [ ] No horizontal scroll
  - [ ] Optimal spacing

#### ✅ Browser Compatibility

- [ ] **Chrome** (latest)
- [ ] **Firefox** (latest)
- [ ] **Safari** (latest)
- [ ] **Edge** (latest)

#### ✅ Performance

- [ ] **Page Load Times**
  - [ ] Dashboard loads < 3 seconds
  - [ ] Case list loads < 2 seconds
  - [ ] Case detail loads < 2 seconds
  - [ ] Document generation < 5 seconds

- [ ] **Interactions**
  - [ ] Forms respond instantly
  - [ ] Search is responsive
  - [ ] No lag in UI

---

## Test Scenarios

### Scenario 1: New Case Creation (Happy Path)

**Objective:** Verify complete case creation workflow

**Steps:**
1. Login as Staff user
2. Navigate to Cases → New Case
3. Fill in incident details:
   - Title: "Noise Complaint"
   - Type: "Noise Disturbance"
   - Date: Today
   - Location: "123 Main St"
4. Add narrative
5. Add complainant:
   - Name: "Juan Dela Cruz"
   - Contact: "09171234567"
   - Address: "123 Main St"
6. Add respondent:
   - Name: "Maria Santos"
   - Contact: "09187654321"
   - Address: "124 Main St"
7. Submit form

**Expected Results:**
- ✅ Case created successfully
- ✅ Case number auto-generated
- ✅ Redirected to case detail page
- ✅ All data displays correctly
- ✅ Status is "New"
- ✅ Audit log entry created

---

### Scenario 2: Guest Evidence Upload (Happy Path)

**Objective:** Verify guest can upload evidence

**Steps:**
1. Login as Staff
2. Open a case
3. Generate guest link for complainant
4. Copy guest link
5. Logout
6. Open guest link in incognito window
7. Enter PIN
8. Accept terms
9. Upload photo (< 5MB)
10. Verify upload success

**Expected Results:**
- ✅ Guest link accessible
- ✅ PIN verification works
- ✅ Terms displayed and accepted
- ✅ File uploads successfully
- ✅ File appears in evidence list
- ✅ Audit log entry created

---

### Scenario 3: Document Generation (Happy Path)

**Objective:** Verify document generation works

**Steps:**
1. Login as Staff
2. Open a case with complete data
3. Click Actions → Generate Document
4. Select "Summons"
5. Preview document
6. Download PDF

**Expected Results:**
- ✅ Document preview displays
- ✅ All data populated correctly
- ✅ Barangay logo displays
- ✅ PDF downloads successfully
- ✅ PDF is properly formatted
- ✅ Can be printed

---

### Scenario 4: Case Status Workflow

**Objective:** Verify case progresses through statuses

**Steps:**
1. Create new case (Status: New)
2. Update status to "Under Investigation"
3. Schedule hearing
4. Update status to "Hearing Scheduled"
5. Add settlement details
6. Update status to "Settled"
7. Close case

**Expected Results:**
- ✅ Each status update succeeds
- ✅ Status badge updates
- ✅ Timeline shows all changes
- ✅ Proceedings tracker updates
- ✅ Settled case becomes read-only
- ✅ Audit log records all changes

---

### Scenario 5: Error Handling

**Objective:** Verify system handles errors gracefully

**Test Cases:**
- [ ] Invalid login shows error message
- [ ] Network error shows retry option
- [ ] File too large shows size error
- [ ] Invalid file type shows format error
- [ ] Expired guest link shows clear message
- [ ] Database error shows user-friendly message
- [ ] Missing required field shows validation error

---

## Future: Automated Testing

### Planned Testing Framework

**Tools:**
- **Playwright** - E2E testing
- **Jest** - Unit testing
- **React Testing Library** - Component testing
- **MSW** - API mocking

### Priority Test Cases

#### 1. Authentication (High Priority)
```typescript
describe('Authentication', () => {
  test('should login with valid credentials', async () => {
    // Test implementation
  });
  
  test('should show error with invalid credentials', async () => {
    // Test implementation
  });
  
  test('should enforce rate limiting', async () => {
    // Test implementation
  });
});
```

#### 2. Case Creation (High Priority)
```typescript
describe('Case Creation', () => {
  test('should create case with valid data', async () => {
    // Test implementation
  });
  
  test('should validate required fields', async () => {
    // Test implementation
  });
  
  test('should auto-generate case number', async () => {
    // Test implementation
  });
});
```

#### 3. Guest Upload (High Priority)
```typescript
describe('Guest Upload', () => {
  test('should verify PIN correctly', async () => {
    // Test implementation
  });
  
  test('should upload file successfully', async () => {
    // Test implementation
  });
  
  test('should enforce file size limit', async () => {
    // Test implementation
  });
});
```

### Running Tests (Future)

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e

# E2E headed mode (see browser)
npm run test:e2e:headed

# Specific test file
npm run test -- auth.test.ts
```

---

## Performance Testing

### Load Testing

**Objective:** Verify system handles expected load

**Scenarios:**
1. **Concurrent Users**
   - 10 users browsing simultaneously
   - 5 users creating cases simultaneously
   - 3 users uploading files simultaneously

2. **Data Volume**
   - 1,000 cases in database
   - 5,000 cases in database
   - 10,000 cases in database

3. **File Uploads**
   - Single 10MB file
   - 10 files simultaneously
   - 100 files in queue

**Tools:**
- Apache JMeter
- k6
- Artillery

**Metrics:**
- Response time < 2 seconds
- Error rate < 1%
- Throughput > 100 req/sec

---

## Security Testing

### Security Checklist

- [ ] **Authentication**
  - [ ] Password strength enforced
  - [ ] Rate limiting works
  - [ ] Session timeout works
  - [ ] Logout clears session

- [ ] **Authorization**
  - [ ] RLS policies enforced
  - [ ] Role checks work
  - [ ] Cannot access unauthorized data
  - [ ] API endpoints protected

- [ ] **Input Validation**
  - [ ] SQL injection prevented
  - [ ] XSS attacks prevented
  - [ ] File upload validation works
  - [ ] Form validation works

- [ ] **Data Protection**
  - [ ] HTTPS enforced
  - [ ] Sensitive data encrypted
  - [ ] Passwords hashed
  - [ ] API keys not exposed

### Penetration Testing

**Recommended:**
- OWASP ZAP scan
- Burp Suite scan
- Manual security review

**Frequency:**
- Before major releases
- Quarterly for production
- After security updates

---

## Test Data

### Seed Data

Use `supabase/seed_data.sql` for test data:
- 2 admin users
- 3 staff users
- 10 sample cases
- 20 involved parties
- 5 hearings
- 10 evidence files

### Test Accounts

**Admin:**
- Email: `admin@barangay.local`
- Password: `Admin123!`

**Staff:**
- Email: `staff@barangay.local`
- Password: `Staff123!`

**Note:** Change passwords on first login

---

## Reporting Bugs

When you find a bug during testing:

1. **Check if already reported**
2. **Create GitHub issue** with:
   - Clear title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/videos
   - Browser/OS info
   - Error messages

3. **Label appropriately:**
   - `bug` - Confirmed bug
   - `needs-investigation` - Unclear if bug
   - `critical` - Blocks functionality
   - `minor` - Cosmetic issue

---

## Contributing Tests

Want to help improve test coverage?

1. Read [Contributing Guidelines](./CONTRIBUTING.md)
2. Pick a test case from roadmap
3. Write test following conventions
4. Submit pull request

**Test Writing Guidelines:**
- Clear test names
- Arrange-Act-Assert pattern
- Independent tests (no dependencies)
- Clean up after tests
- Mock external services

---

**Last Updated:** December 12, 2025  
**Version:** 1.0.0

*Help us improve testing by [contributing](./CONTRIBUTING.md)!*
