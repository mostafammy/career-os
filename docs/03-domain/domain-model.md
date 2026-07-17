# Domain Model Specification

Version: 1.0

Status: Draft

Owner: Product Architecture

---

# 1. Purpose

The Domain Model defines the core business concepts of CareerOS.

It establishes:

- Entities
- Relationships
- Lifecycles
- Behaviors
- Business Rules
- Events
- Ownership
- Derived Properties

The Domain Model is independent of:

- Database implementation
- User Interface
- Programming language
- Framework
- Infrastructure

---

# 2. Domain Principles

DM-001

Every entity represents a meaningful business concept.

---

DM-002

Every entity has a unique identity.

---

DM-003

Behavior belongs to entities—not controllers.

---

DM-004

Relationships should reflect real-world semantics.

---

DM-005

Domain logic remains independent of infrastructure.

---

DM-006

The domain language is shared across Product, Design, Engineering, and AI.

---

# 3. Core Entity Map

CareerOS consists of the following primary entities.

```

User

↓

Vision

↓

Mission

↓

Goal

↓

Milestone

↓

Opportunity

↓

Application

↓

Organization

↓

Task

↓

Document

↓

Calendar Event

↓

Reminder

↓

Reflection

↓

Decision Journal

↓

Knowledge Entry

↓

Career Capital

↓

Activity

↓

Notification

```

---

# 4. Entity Categories

Strategic

Vision

Mission

Goal

Milestone

Career Capital

---

Operational

Opportunity

Application

Task

Reminder

Calendar Event

---

Knowledge

Knowledge Entry

Reflection

Decision Journal

AI Insight

---

Resources

Document

Organization

Contact

Template

---

System

Notification

Activity

Automation

Integration

Settings

---

# 5. Entity Definition Template

Every entity shall define:

Purpose

Identity

Attributes

Relationships

Lifecycle

Business Rules

Domain Events

Computed Properties

Permissions

Validation Rules

Future Extensions

---

# 6. Opportunity

Purpose

Represents a potential career opportunity worth evaluating.

Examples

Scholarship

Internship

Job

Hackathon

Conference

Research Position

Grant

Competition

Exchange Program

---

Identity

Opportunity ID

Immutable

Globally unique

---

Relationships

Belongs to:

User

May belong to:

Mission

Goal

Organization

Contains:

Applications

Tasks

Documents

Knowledge

Activities

Timeline

AI Insights

---

Lifecycle

```

Captured

↓

Researching

↓

Preparing

↓

Ready

↓

Submitted

↓

Interview

↓

Completed

↓

Archived

```

---

Business Rules

Deadline cannot precede creation.

Archived opportunities cannot receive new applications.

Deleted opportunities remain recoverable until retention policy expires.

Opportunity status transitions must follow lifecycle rules.

---

Domain Events

Opportunity Created

Opportunity Updated

Opportunity Archived

Opportunity Deleted

Opportunity Restored

Opportunity Scored

Deadline Changed

Priority Changed

---

Computed Properties

Opportunity Score

Days Remaining

Preparation Progress

Application Count

Completion Percentage

Risk Level

Strategic Alignment

---

# 7. Application

Purpose

Represents one submission to one opportunity.

Relationships

Belongs to:

Opportunity

Organization

Contains:

Documents

Interview Notes

Reflection

Timeline

Lifecycle

```

Draft

↓

Preparing

↓

Submitted

↓

Interview

↓

Offer

↓

Accepted

↓

Rejected

↓

Withdrawn

↓

Archived

```

---

Computed Properties

Readiness Score

Submission Duration

Waiting Time

Interview Count

Success Probability

---

# 8. Organization

Purpose

Represents an external institution.

Examples

University

Company

NGO

Research Institute

Government Agency

Relationships

Owns

Opportunities

Applications

Contacts

Knowledge

Analytics

---

Computed Properties

Historical Success Rate

Relationship Strength

Average Response Time

Career Capital Contribution

---

# 9. Goal

Purpose

Represents a measurable strategic objective.

Relationships

Belongs to:

Mission

Contains:

Milestones

Opportunities

Career Capital

---

Computed Properties

Progress

Remaining Effort

Confidence

Strategic Value

---

# 10. Document

Purpose

Represents reusable assets.

Examples

CV

Passport

Essay

Recommendation Letter

Portfolio

Certificate

Transcript

---

Relationships

Linked to:

Applications

Goals

Organizations

Opportunities

---

Computed Properties

Version Count

Reuse Count

Expiration Status

Current Version

---

# 11. Reflection

Purpose

Captures structured learning after meaningful events.

Relationships

Linked to:

Application

Opportunity

Goal

Decision Journal

Knowledge Base

---

Computed Properties

Insight Count

Learning Score

---

# 12. Activity

Purpose

Immutable historical record.

Activities never change.

Activities never disappear.

Activities explain:

Who

What

When

Why

---

# 13. Entity Relationships

```

Vision

↓

Mission

↓

Goal

↓

Milestone

↓

Opportunity

↓

Application

↓

Reflection

↓

Knowledge

```

Documents connect horizontally.

Organizations connect horizontally.

Activities observe everything.

---

# 14. Domain Events

Every entity publishes events.

Examples

Created

Updated

Archived

Deleted

Linked

Completed

Reviewed

Scored

Every subsystem reacts to events.

---

# 15. Aggregate Roots

Aggregate Roots include:

Opportunity

Application

Goal

Organization

Document

Each aggregate protects its own consistency.

---

# 16. Ubiquitous Language

The following terms have canonical meanings:

Opportunity

Application

Mission

Goal

Reflection

Knowledge

Decision

Workspace

Timeline

Activity

These meanings remain consistent throughout the product.

---

# 17. Domain Principles

Entities own behavior.

Relationships represent reality.

Business rules belong in the domain.

Infrastructure serves the domain.

The domain outlives technology.



🏛 Principal Engineer Review — The Most Important Architectural Insight

Daphi, this is where I would make what I believe is the single biggest improvement to CareerOS.

Replace CRUD Thinking with Domain-Driven Design (DDD)

Most applications are built around CRUD:

Create Opportunity

Read Opportunity

Update Opportunity

Delete Opportunity

That's how databases think.

But users don't think that way.

Instead, define intent-based operations:

Capture Opportunity

Research Opportunity

Prepare Application

Submit Application

Schedule Interview

Complete Reflection

Review Strategy

Archive Opportunity

Notice these are verbs from the user's world, not database operations.

This shift has profound effects:

APIs become more expressive.
Business rules become clearer.
Events map naturally to real actions.
Automation becomes easier.
AI recommendations gain better context.

For example, instead of an endpoint like:

PATCH /opportunities/123

you might expose domain-oriented actions such as:

CaptureOpportunity
AdvanceOpportunityStage
SubmitApplication
ArchiveOpportunity
CompleteReflection

Internally, these still result in data changes—but the architecture is driven by business intent, not storage mechanics.
