# Supabase SQL Schema Organization

## 📁 File Structure

```
supabase/
├── schema.sql                          # Main schema (complete database structure)
├── seed_data.sql                       # Sample/initial data
└── migrations/
    └── 001_complete_fixes.sql          # All RLS & function fixes (Dec 2025)
```

## 🚀 How to Apply

### Option 1: Fresh Database (Recommended for New Projects)

Run in this exact order:

1. **Apply main schema**
   ```sql
   -- Copy and run: supabase/schema.sql
   ```

2. **Apply fixes migration**
   ```sql
   -- Copy and run: supabase/migrations/001_complete_fixes.sql
   ```

3. **Seed data (optional)**
   ```sql
   -- Copy and run: supabase/seed_data.sql
   ```

### Option 2: Existing Database (Update Only)

If your database already has the initial schema:

```sql
-- Only run: supabase/migrations/001_complete_fixes.sql
```

---

## 📋 What Each File Contains

### `schema.sql` (Main Schema)
- **Tables**: profiles, cases, involved_parties, case_notes, evidence, audit_logs, guest_links, notifications, hearings, barangay_settings
- **Enums**: case_status, party_type, incident_type
- **Functions**: handle_new_user, get_guest_link_by_token, get_case_stats_dynamic, get_analytics_charts_dynamic, search_cases, close_guest_links_on_case_closure
- **Views**: party_statistics
- **RLS Policies**: All row-level security policies
- **Storage Buckets**: branding, evidence
- **Indexes**: (Currently commented out based on linter feedback)

### `migrations/001_complete_fixes.sql` (All Fixes)
1. **RLS Policy Optimizations**
   - Wraps `auth.uid()` calls in subqueries for better performance
   - Consolidates duplicate policies on `audit_logs` table

2. **Function Fixes**
   - Fixes `search_cases` type mismatch (`match_rank` real vs float)

3. **Grants**
   - Proper execute permissions for all RPC functions

---

## 🔧 Applying via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in left sidebar
3. Click **New Query**
4. Copy entire contents of the file
5. Paste and click **Run** (or Ctrl+Enter)

---

## ✅ Verification

After applying the migration, verify everything works:

```sql
-- 1. Check RLS policies
SELECT tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 2. Check function exists with correct signature
SELECT routine_name, routine_type, data_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'search_cases';

-- 3. Check grants
SELECT grantee, privilege_type 
FROM information_schema.routine_privileges 
WHERE routine_schema = 'public' 
AND routine_name = 'search_cases';
```

---

## 🗑️ Obsolete Files (Can be deleted)

The following files in `migrations/` were temporary and are now consolidated into `001_complete_fixes.sql`:
- `20251203_optimize_rls_policies.sql`
- `fix_rpc_grants.sql`
- `fix_search_cases_type.sql`
- `verify_grants.sql`

You can safely delete these after confirming `001_complete_fixes.sql` works.

---

## 📝 Notes

- **Always backup** before running migrations on production
- The main `schema.sql` is kept as the source of truth
- All future changes should be added as numbered migrations (002, 003, etc.)
- Migrations are designed to be idempotent (safe to run multiple times)
