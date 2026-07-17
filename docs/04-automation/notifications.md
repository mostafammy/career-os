# Notification Architecture & Rules

**File:** `docs/04-automation/notifications.md`

---

# Notification Rules & Triggers

**Status:** Canonical
**Version:** 1.0

---

## Philosophy: The Calm Partner

As stated in our vision, **CareerOS should feel like a calm, intelligent partner.** Technology should quietly support the user instead of demanding attention.

1. **No Vanity Notifications:** We never notify a user just to drive "engagement" or "daily active use." 
2. **Action-Oriented:** A notification should only exist if there is a specific, time-sensitive action the user must take.
3. **Easily Muted:** The user owns their attention. All notification channels must be granularly configurable.

---

## Notification Channels

CareerOS utilizes three distinct channels based on urgency and context:

### 1. In-App Inbox (The Default)
- **Urgency:** Low to Medium.
- **Behavior:** Silent. The user sees these only when they intentionally open CareerOS to work on their career.
- **Use Cases:** 
  - AI extracted new data for review.
  - A new "Reflection" task was generated.
  - A long-term Goal milestone is due this week.

### 2. Email (The Digest)
- **Urgency:** Medium.
- **Behavior:** Batched. We prefer a single "Daily/Weekly Briefing" over piecemeal emails.
- **Use Cases:**
  - Weekly summary of upcoming deadlines.
  - "Stale Pipeline" warning (e.g., 3 applications haven't moved in 14 days).
  - Career Capital growth summary (e.g., "You generated 4 new reusable assets this month").

### 3. Push / System Notifications (The Exception)
- **Urgency:** High / Critical.
- **Behavior:** Interruptive. Reserved strictly for events with hard, unrecoverable deadlines.
- **Use Cases:**
  - **Impending Deadline:** An Actioned Opportunity is due in < 24 hours and is not marked Submitted.
  - **Interview Imminent:** An interview Activity is starting in 30 minutes.

---

## Core Notification Triggers

| Trigger Event | Channel | Logic & Threshold |
| :--- | :--- | :--- |
| **Hard Deadline Approaching** | Push + Email | `Opportunity` deadline is < 24 hrs AND State is `ACTIONED`. |
| **Soft Deadline Reminder** | In-App + Email Digest | `Opportunity` deadline is < 7 days AND State is `CAPTURED` or `EVALUATING`. |
| **Post-Interview Reflection** | In-App (High Priority) | Triggered exactly 1 hour after an `Activity` of type "Interview" concludes. |
| **Follow-up Reminder** | In-App | 14 days post-`SUBMITTED` with no status change. |
| **Duplicate Detected** | In-App (Low Priority) | AI Worker detects a duplicate capture during extraction. |
| **Goal Drift Warning** | Email Digest | User has applied to 5+ Opportunities recently with a "Low Fit Score" against their active Goals. |

---

## Anti-Spam Constraints

- **The Weekend Rule:** Unless a hard deadline is within 48 hours, non-urgent emails and push notifications should respect the user's defined "Quiet Hours" and weekends.
- **Batching over Streaming:** If 5 Opportunities hit a "Follow-up Reminder" threshold on the same day, they must be batched into a single notification: *"You have 5 applications ready for follow-up"*, rather than 5 separate pings.
- **Auto-Squelch:** If a user consistently ignores "Follow-up Reminders" for a specific Opportunity without dismissing them, the system will stop notifying them about that specific Opportunity after 3 attempts, auto-transitioning it to a "Stale/Archived" state.
