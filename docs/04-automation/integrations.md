# Third-Party Integrations

**File:** `docs/04-automation/integrations.md`

---

# Integration Strategy & Specifications

**Status:** Canonical
**Version:** 1.0

---

## Purpose
This document defines how CareerOS interacts with the broader software ecosystem. CareerOS is designed to be the central node of a user's professional life, but it intentionally avoids reinventing existing tools. 

---

## Integration Philosophy

All integrations must strictly adhere to **Product Principle P-008: One Source of Truth**.

> *Duplicate ownership leads to inconsistency.*
> *Calendar events belong to the Calendar provider.*
> *Files belong to cloud storage.*
> *Opportunities belong to CareerOS.*

CareerOS acts as an orchestration and metadata layer. It references external data rather than copying it wholesale whenever possible.

---

## Core Integrations

### 1. Calendar (Google Calendar, Microsoft Outlook)
**Direction:** Bidirectional sync (preferring reference).
- **Outbound (Syncing to Calendar):** When an `Activity` of type "Interview" is created in CareerOS, it pushes an event to the user's primary calendar. The event description contains a deep link back to the CareerOS Application Workspace.
- **Inbound (Listening to Calendar):** CareerOS monitors the calendar for events matching active `Organizations` in the user's pipeline. When an interview event concludes, CareerOS automatically triggers the **Reflection & Debrief Workflow**.

### 2. Cloud Storage (Google Drive, Dropbox, OneDrive)
**Direction:** Inbound reference.
- CareerOS does not act as a primary file host for massive portfolios. 
- The `Document` entity within CareerOS stores metadata (Title, Document Type, Version, Tags) and a direct URI pointer to the file in the user's cloud storage.
- **Automation:** If a user updates their "Master Resume" in Google Drive, the `Document` entity in CareerOS remains accurate because it is a pointer, not a static copy.

### 3. Email (Gmail, Microsoft Exchange)
**Direction:** Read-only context + Capture.
- **Capture:** Users can forward emails (e.g., recruiter outreaches, acceptance letters) to a secure inbound CareerOS address to automatically trigger the `Capture Flow`.
- **Contextual View:** Within the `Organization` aggregate, CareerOS can use OAuth to surface recent email threads with contacts at that company. CareerOS is *not* an email client; it simply provides read-only context to prevent context-switching.

### 4. Professional Networks (LinkedIn, GitHub, Dribbble)
**Direction:** Inbound extraction.
- **Profile Syncing:** Users can periodically sync their LinkedIn or GitHub profiles. 
- **Automation:** The system parses these profiles to automatically update the user's baseline `Career Capital` (e.g., adding a new GitHub repository as a "Project" asset, or updating their master skill list based on a new LinkedIn endorsement).

---

## Technical & Security Constraints

Following **Product Principle P-010: Trust is the Foundation**:
1. **Least Privilege:** OAuth scopes must be strictly limited. CareerOS should only request read access to email threads that explicitly match active Opportunity contacts, not the user's entire inbox.
2. **Revocability:** Users must be able to sever an integration at any time with a single click. When an integration is severed, CareerOS must retain the metadata it generated but immediately drop any cached external payloads.
3. **Graceful Degradation:** If an external API goes down (e.g., Google Calendar API is unreachable), CareerOS must queue the outbound events and not block the user from navigating or updating their pipeline locally.
