# CareerOS Product Principles

**File:** `docs/00-overview/product-principles.md`

---

# CareerOS Product Principles

**Status:** Canonical
**Version:** 1.0

---

# Purpose

This document defines the fundamental principles that guide every product decision within CareerOS.

These principles are intentionally long-lived and technology-independent. They provide a consistent decision-making framework for Product, Design, Engineering, AI, and future contributors.

Whenever multiple solutions are possible, the option that best aligns with these principles should be preferred.

> **"Features evolve. Principles endure."**

---

# Core Philosophy

CareerOS is not a task manager.

CareerOS is not a note-taking application.

CareerOS is not a CRM.

CareerOS is not a project management tool.

CareerOS is a **Career Operating System**—a platform that helps people make better career decisions, execute opportunities effectively, and continuously learn from experience.

Every feature should strengthen that mission.

---

# Product Principles

## P-001 — Optimize for Decisions, Not Data

CareerOS exists to improve decision quality.

The product should never collect information merely because it can.

Every piece of information should contribute to helping the user make better decisions.

**Questions**

* Does this information improve a future decision?
* Will the user benefit from recording it?
* Can we derive it instead of asking for it?

---

## P-002 — Capture First, Organize Later

Capturing information should require minimal effort.

Organization should happen after capture.

Users should never lose opportunities because the capture workflow was too complicated.

**Examples**

* Opportunity Inbox
* Browser Extension
* Quick Capture
* Email Import

---

## P-003 — Simplicity is a Competitive Advantage

Complex systems should feel simple.

The product should hide complexity without removing capability.

Power should emerge progressively rather than appearing immediately.

**Design Implications**

* Progressive disclosure
* Sensible defaults
* Clear language
* Minimal cognitive load

---

## P-004 — The User Owns Their Career

CareerOS exists to support—not replace—human judgment.

Recommendations should assist users rather than making decisions for them.

AI should augment thinking, never override it.

Users remain responsible for all strategic decisions.

---

## P-005 — Build Once, Reuse Everywhere

Information should be reusable.

Users should never recreate knowledge that already exists.

Examples include:

* Documents
* Essays
* Reflections
* Templates
* Knowledge Entries

Every completed opportunity should increase future efficiency.

---

## P-006 — Knowledge Compounds

Every completed activity should leave behind reusable knowledge.

CareerOS should continuously transform experience into structured learning.

Examples include:

* Reflections
* Decision Journals
* AI Insights
* Lessons Learned

The system becomes more valuable with continued use.

---

## P-007 — Everything Has Context

Information without context is difficult to interpret.

Every major entity should explain:

* Why it exists
* How it relates to other entities
* What depends on it
* What should happen next

Relationships are first-class citizens.

---

## P-008 — One Source of Truth

Every piece of information should have one canonical owner.

Examples:

* Calendar events belong to the Calendar provider.
* Files belong to cloud storage.
* Opportunities belong to CareerOS.

Duplicate ownership leads to inconsistency.

---

## P-009 — Design Around Intent

Interfaces should reflect what users are trying to accomplish rather than how the system is implemented.

Examples:

Prefer:

* Capture Opportunity
* Submit Application
* Complete Reflection

Instead of:

* Create Record
* Update Entry
* Edit Object

The language of the interface should match the user's mental model.

---

## P-010 — Trust is the Foundation

Users will store highly valuable personal information.

Trust must never be compromised.

This includes:

* Privacy
* Transparency
* Security
* Reliability
* Data ownership
* Explainable AI

Every product decision should strengthen user trust.

---

## P-011 — Make Progress Visible

People remain motivated when progress is visible.

CareerOS should continuously communicate meaningful progress.

Examples include:

* Goal completion
* Career Capital growth
* Milestone completion
* Weekly achievements
* Opportunity pipeline

Avoid vanity metrics.

---

## P-012 — Favor Long-Term Value

Short-term convenience should not compromise long-term usability.

When trade-offs exist, prioritize sustainable solutions over temporary optimizations.

CareerOS should remain useful over decades rather than months.

---

## P-013 — Every Screen Should Answer One Question

Every interface should have a clear purpose.

Examples:

Dashboard

> What deserves my attention today?

Inbox

> What have I captured that still needs processing?

Opportunity Workspace

> How do I maximize my chances for this opportunity?

Analytics

> How am I improving over time?

If a screen cannot answer a clear question, reconsider its purpose.

---

## P-014 — Defaults Should Be Intelligent

The product should reduce unnecessary decisions.

Examples:

* Smart defaults
* Automatic categorization
* Suggested priorities
* Recommended next actions

Users should always retain the ability to override defaults.

---

## P-015 — Consistency Builds Confidence

Identical concepts should behave identically across the platform.

Users should not need to relearn interaction patterns.

Consistency applies to:

* Navigation
* Terminology
* Layout
* Actions
* Visual hierarchy
* Keyboard shortcuts

---

## P-016 — Explain Before You Automate

Automation should remain understandable.

Users should know:

* Why something happened
* Which rule triggered it
* How to modify it

Automation should feel predictable rather than mysterious.

---

## P-017 — Optimize for Flow

The product should reduce interruptions.

Common workflows should require minimal context switching.

Users should remain focused on career progress rather than software operation.

---

## P-018 — The Product Learns With the User

CareerOS should become increasingly valuable as more information is accumulated.

Long-term users should receive:

* Better recommendations
* Better prioritization
* Better automation
* Better forecasting

The product should improve through experience.

---

# Decision Framework

Before introducing any feature, ask:

1. Does it improve career decision-making?
2. Does it reduce cognitive load?
3. Does it increase long-term value?
4. Does it strengthen trust?
5. Does it align with the user's mental model?
6. Does it preserve simplicity?
7. Will this still make sense five years from now?

If the answer to multiple questions is "No", reconsider the feature.

---

# Product Anti-Principles

CareerOS intentionally avoids becoming:

* A generic productivity suite
* A social network
* A file storage service
* A replacement for email
* A replacement for calendar providers
* A generic note-taking application
* A feature collection without strategic coherence

Focus creates clarity.

---

# Final Principle

> **CareerOS succeeds when users become better at building careers—not better at using CareerOS.**
