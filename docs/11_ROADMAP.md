# 🗺️ Project Roadmap & Known Issues

This document outlines the planned future enhancements, current technical debt, and known issues for the BlotterSys project.

---

## 🏗️ Technical Debt & Immediate Fixes

These items are high-priority tasks to improve code quality and system robustness.

1.  **Server-Side Validation for Custom Incident Types**
    *   **Current State:** Frontend allows "Other" input, but backend validation is missing.
    *   **Goal:** Implement Zod validation and database storage for `incident_type_other`.

2.  **Type Safety Improvements**
    *   **Current State:** `PartyManager.tsx` uses explicit `any` types for search results.
    *   **Goal:** Define proper TypeScript interfaces for search results and remove `any`.

3.  **UI/UX Refinement**
    *   **Current State:** User edit modal reloads the page on success.
    *   **Goal:** Implement a "Success Toast" notification and client-side state update instead of a full reload.

---

## 🔮 Future Enhancements (Medium Term)

Features planned for upcoming sprints.

1.  **Automated Testing**
    *   Implement **Playwright** for End-to-End (E2E) testing of critical flows (Case Creation, Guest Upload).

2.  **API Documentation**
    *   Create detailed API reference for the `/api/documents/download` and `/api/auth/callback` endpoints.

3.  **Internationalization (i18n)**
    *   Add support for Local Dialects / Tagalog to make the system more accessible to barangay constituents.

---

## 🚀 Long-Term Vision

1.  **Real-Time Notifications**
    *   Use Supabase Realtime to push updates to the dashboard without refreshing (e.g., when a guest uploads evidence).

2.  **Multi-Barangay Support**
    *   Refactor schema to support multi-tenancy (multiple barangays using the same instance).

3.  **Mobile Companion App**
    *   Develop a React Native mobile app for Tanods to inspect and report from the field.

4.  **AI Analytics**
    *   Integrate AI to analyze crime hotspots and suggest preventative measures based on blotter data.
