# Automation Specifications

**File:** `docs/04-automation/automation-spec.md`

---

# Deterministic Automation Rules

**Status:** Canonical
**Version:** 1.0

---

## Purpose
While `ai-features.md` covers probabilistic, machine-learning-driven features, this document defines the **deterministic, rule-based automations** in CareerOS. 

These automations reduce the administrative burden of tracking applications, ensuring the user never misses a deadline or a crucial follow-up without requiring manual data entry for every step.

---

## Core Philosophy

Following Product Principle **P-016: Explain Before You Automate**:
- All automations must be completely transparent to the user.
- Whenever an automated action occurs, there must be a visible audit log (e.g., *"Application created automatically because Opportunity was marked as Actioned"*).
- Users must have the ability to toggle or override these behaviors in their settings.

---

## 1. Lifecycle & State Automations

These rules fire when an entity changes state (refer to `state-machines.md`).

| Trigger | Condition | Automated Action |
| :--- | :--- | :--- |
| **Opportunity** state changes to `ACTIONED` | Has no child Application | Automatically create an `Application` entity in `DRAFTING` state linked to the Opportunity. |
| **Application** state changes to `INTERVIEWING` | No Interview Activity exists | Automatically create a pending `Activity` of type "Interview" and prompt user for Date/Time. |
| **Application** state changes to `REJECTED`, `ACCEPTED`, or `DECLINED` | No Reflection exists | Automatically generate a `Reflection` task linked to the Application and place it in the user's Inbox. |
| **Goal** state changes to `COMPLETED` | N/A | Automatically trigger a "Career Capital Review" prompt to formally log the achieved Goal. |

---

## 2. Temporal (Time-Based) Automations

These rules fire based on the passage of time relative to stored dates.

| Trigger | Condition | Automated Action |
| :--- | :--- | :--- |
| **Deadline Approach** | `Opportunity` deadline is < 48 hours away AND state is `CAPTURED` or `EVALUATING` | Add to "Urgent Decisions" dashboard view; trigger push/email notification. |
| **Submission Follow-up** | `Application` state is `SUBMITTED` AND 14 days have passed | Create a Task: *"Follow up on application status"* and provide a drafted follow-up email template. |
| **Interview Follow-up** | `Activity` (Interview) occurred 24 hours ago | Create a Task: *"Send Thank You note to interviewers."* |
| **Stale Opportunity** | `Opportunity` state is `CAPTURED` AND > 30 days old with no deadline | Auto-transition state to `ARCHIVED` (with an undo toast notification). |

---

## 3. Organizational Automations

These rules fire to keep the graph of entities clean and organized.

| Trigger | Condition | Automated Action |
| :--- | :--- | :--- |
| **Opportunity Created** | Matches an existing `Organization` domain/name | Automatically link the Opportunity to the existing `Organization` aggregate. |
| **Contact Added** | Email domain matches an existing `Organization` | Automatically link the Contact to the Organization. |
| **Document Uploaded** | Attached directly to an `Application` | Automatically tag the Document with the Organization Name and Role Title for future searchability. |

---

## Technical Constraints

- **Idempotency:** All automations must be idempotent. If a rule fires twice (due to network retries), it should not create duplicate tasks or applications.
- **Auditability:** Every record mutated by an automation must have an `updated_by` field set to `system:automation` and include an `automation_reason` string.
- **Circuit Breakers:** If an automation fails (e.g., unable to link an Organization), it must fail gracefully without blocking the user's core action.
