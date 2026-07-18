📘 Entity Relationship Model (ERM) & Domain Relationship Specification

Status: Architecture Draft v1.0

Owner: Principal Architecture

Purpose: Define the canonical relationships between all domain entities independently of persistence technology.

1. Philosophy

The Entity Relationship Model describes the semantic relationships of CareerOS.

It deliberately avoids implementation details such as:

Tables
ORM models
Foreign keys
Indexes
Data types

Those belong to the Database Specification.

Instead, this document defines:

Ownership
Identity
Aggregates
Cardinality
Lifecycle
Referential Integrity
Navigation
Domain Invariants
2. Architectural Layers
Vision
        │
Mission
        │
Goal
        │
Milestone
        │
Opportunity
        │
Application
        │
Reflection
        │
Knowledge

Everything else enriches this spine.

Think of this as the Career Lifecycle Pipeline.

3. Aggregate Map

One of the most important DDD concepts.

Not every entity should be modified independently.

Instead:

User
│
├── Vision Aggregate
│
├── Goal Aggregate
│
├── Opportunity Aggregate
│
├── Organization Aggregate
│
├── Document Aggregate
│
└── Knowledge Aggregate

Each aggregate owns its own consistency.

4. Opportunity Aggregate

This is probably the heart of CareerOS.

Opportunity
│
├── Applications
│
├── Tasks
│
├── Timeline
│
├── Activities
│
├── AI Insights
│
├── Requirements
│
├── Notes
│
└── Related Documents

Rule:

Everything inside this aggregate should remain consistent through the Opportunity root.

Nothing modifies child entities directly.

5. Application Aggregate
Application
│
├── Submission
├── Documents
├── Interview
├── Reflection
├── Timeline
├── Activities
└── Attachments

The Application is responsible for maintaining its own lifecycle.

6. Goal Aggregate
Goal
│
├── Milestones
├── Metrics
├── Opportunities
├── Progress History
└── Career Capital

Goals are not passive.

They evaluate themselves.

7. Organization Aggregate
Organization
│
├── Opportunities
├── Contacts
├── Applications
├── Reputation
├── Notes
└── Analytics
8. Knowledge Aggregate
Knowledge

├── Reflection

├── Decision Journal

├── AI Insight

├── Research Notes

├── Lessons Learned

└── References

Notice:

Knowledge becomes its own domain.

Not random markdown notes.

9. Cardinality Matrix

Now comes the Principal-level thinking.

Instead of hundreds of arrows, define relationships explicitly.

Entity A	Relationship	Entity B	Cardinality
User	owns	Vision	1 → 1
Vision	contains	Mission	1 → N
Mission	contains	Goal	1 → N
Goal	contains	Milestone	1 → N
Goal	influences	Opportunity	N ↔ N
Organization	publishes	Opportunity	1 → N
Opportunity	produces	Application	1 → N
Opportunity	requires	Document	N ↔ N
Opportunity	generates	Activity	1 → N
Application	references	Document	N ↔ N
Application	generates	Reflection	1 → 0..1
Reflection	creates	Knowledge Entry	1 → N
Knowledge Entry	supports	Goal	N ↔ N

Immediately everyone understands the domain.

10. Relationship Types

Not all relationships are equal.

Ownership
Goal

↓

Milestone

Destroy Goal

↓

Milestones disappear.

Reference
Application

↓

Organization

Delete Organization?

Application survives.

Association
Opportunity

↓

Document

Removing one does not delete the other.

Derived
Opportunity

↓

Career Capital

Calculated.

Not stored.

11. Referential Rules

Every relationship declares behavior.

Example:

Opportunity → Application

Deletion Policy

Delete Opportunity

↓

Archive Applications

↓

Never hard delete automatically.
Goal → Milestone
Delete Goal

↓

Delete Milestones
Document
Delete Document

↓

Prevent if still referenced.
12. Relationship Strength

This is rarely documented but extremely valuable.

Every relationship has a strength.

Strong

Cannot exist independently.

Goal

↓

Milestone
Medium

May exist separately.

Application

↓

Document
Weak

Pure reference.

Knowledge

↓

Organization

This determines persistence strategy later.

13. Lifecycle Dependencies

Now we define sequencing.

Example

Capture Opportunity

↓

Research

↓

Prepare

↓

Submit

↓

Interview

↓

Reflection

↓

Knowledge

Reflection cannot happen before Interview.

Knowledge cannot exist before Reflection.

The domain enforces this.

14. Navigation Graph

Think beyond relationships.

Think about user exploration.

Organization

↓

Opportunities

↓

Applications

↓

Documents

↓

Goals

↓

Analytics

Every object should be reachable.

No dead ends.

15. Domain Invariants

This section is what separates senior architecture from ordinary diagrams.

Examples:

INV-001

Every Application belongs to exactly one Opportunity.

INV-002

Every Goal belongs to exactly one Mission.

INV-003

A Milestone cannot belong to multiple Goals.

INV-004

Activities are immutable.

INV-005

Knowledge Entries never lose provenance.

INV-006

Archived entities remain searchable.

INV-007

A Reflection always references a completed event.

INV-008

Documents remain versioned.

INV-009

Every aggregate has exactly one root.

INV-010

Business events never mutate historical events.

16. Domain Event Graph

Instead of CRUD:

Opportunity Created

↓

Requirement Extracted

↓

Tasks Generated

↓

Preparation Started

↓

Application Submitted

↓

Interview Scheduled

↓

Reflection Completed

↓

Knowledge Updated

↓

Career Capital Increased

This graph becomes the backbone of automation.

17. Identity Strategy

Every aggregate receives:

Global Identifier

Immutable

Opaque

Never Reused

Never Meaningful

Never encode business logic into IDs.

Bad:

GOOGLE-2027-001

Good:

opp_01JAF4YZPQ3T0Q2M7G5BXQ1D8R
18. Evolution Rules

The domain will evolve.

Therefore:

Entities may gain attributes.

Relationships may expand.

Aggregates may split.

Events may version.

Canonical identities never change.

---

# 19. Entity Categories

## Strategic

- Vision
- Mission
- Goal
- Milestone
- Career Capital

## Operational

- Opportunity
- Application
- Task
- Reminder
- Calendar Event

## Knowledge

- Knowledge Entry
- Reflection
- Decision Journal
- AI Insight

## Resources

- Document
- Organization
- Contact
- Template

## System

- Notification
- Activity
- Automation
- Integration
- Settings

---

# 20. Entity Definition Template

Every entity shall define:

- Purpose
- Identity
- Attributes
- Relationships
- Lifecycle (canonical source: `docs/03-domain/state-machines.md`)
- Business Rules
- Domain Events
- Computed Properties
- Permissions
- Validation Rules
- Future Extensions

---

# 21. Entity Definitions

## 21.1 Opportunity

**Purpose:** Represents a potential career opportunity worth evaluating.

**Examples:** Scholarship, Internship, Job, Hackathon, Conference, Research Position, Grant, Competition, Exchange Program

**Identity:** Opportunity ID — immutable, globally unique, opaque.

**Lifecycle:** Canonical definition in `docs/03-domain/state-machines.md` (§1 — Opportunity Lifecycle).

**Relationships:**
- Belongs to: User
- May belong to: Mission, Goal, Organization
- Contains: Applications, Tasks, Documents, Knowledge, Activities, Timeline, AI Insights

**Business Rules:**
- Deadline cannot precede creation.
- Archived opportunities cannot receive new applications.
- Deleted opportunities remain recoverable until retention policy expires.
- Opportunity status transitions must follow lifecycle rules (§22).

**Domain Events:**
OpportunityCreated, OpportunityUpdated, OpportunityArchived, OpportunityDeleted, OpportunityRestored, OpportunityScored, DeadlineChanged, PriorityChanged

**Computed Properties:**
Opportunity Score, Days Remaining, Preparation Progress, Application Count, Completion Percentage, Risk Level, Strategic Alignment

---

## 21.2 Application

**Purpose:** Represents one submission to one opportunity.

**Lifecycle:** Canonical definition in `docs/03-domain/state-machines.md` (§2 — Application Lifecycle).

**Relationships:**
- Belongs to: Opportunity, Organization
- Contains: Documents, Interview Notes, Reflection, Timeline

**Computed Properties:**
Readiness Score, Submission Duration, Waiting Time, Interview Count, Success Probability

---

## 21.3 Organization

**Purpose:** Represents an external institution.

**Examples:** University, Company, NGO, Research Institute, Government Agency

**Relationships:**
- Owns: Opportunities, Applications, Contacts, Knowledge, Analytics

**Computed Properties:**
Historical Success Rate, Relationship Strength, Average Response Time, Career Capital Contribution

---

## 21.4 Goal

**Purpose:** Represents a measurable strategic objective.

**Lifecycle:** Canonical definition in `docs/03-domain/state-machines.md` (§3 — Goal Lifecycle).

**Relationships:**
- Belongs to: Mission
- Contains: Milestones, Opportunities, Career Capital

**Computed Properties:**
Progress, Remaining Effort, Confidence, Strategic Value

---

## 21.5 Document

**Purpose:** Represents reusable assets.

**Examples:** CV, Passport, Essay, Recommendation Letter, Portfolio, Certificate, Transcript

**Relationships:**
- Linked to: Applications, Goals, Organizations, Opportunities

**Computed Properties:**
Version Count, Reuse Count, Expiration Status, Current Version

---

## 21.6 Reflection

**Purpose:** Captures structured learning after meaningful events.

**Relationships:**
- Linked to: Application, Opportunity, Goal, Decision Journal, Knowledge Base

**Computed Properties:**
Insight Count, Learning Score

---

## 21.7 Activity

**Purpose:** Immutable historical record. Activities never change. Activities never disappear.

**Explains:** Who, What, When, Why

**Rules:**
- INV-004: Activities are immutable.
- INV-010: Business events never mutate historical events.

---

# 22. Domain Events

Every entity publishes events. Every subsystem reacts to events.

**Standard Events:** Created, Updated, Archived, Deleted, Linked, Completed, Reviewed, Scored

**See:** `docs/05-engineering/ecs.md` for the complete Event Catalog.

---

# 23. Aggregate Roots

Aggregate Roots: Opportunity, Application, Goal, Organization, Document

Each aggregate protects its own consistency. Nothing modifies child entities directly through the root.

---

# 24. Ubiquitous Language

The following terms have canonical meanings. These meanings remain consistent throughout the product.

| Term | Canonical Meaning |
|---|---|
| Opportunity | A potential career path worth evaluating |
| Application | A concrete submission to one opportunity |
| Mission | A strategic objective composed of multiple Goals |
| Goal | A measurable objective supporting one or more Missions |
| Reflection | A structured analysis after a meaningful experience |
| Knowledge | Reusable structured knowledge derived from experience |
| Decision | A recorded reasoning behind an important career choice |
| Workspace | The primary interface for interacting with a single entity |
| Timeline | A chronological representation of significant activities |
| Activity | An immutable historical record of something that happened |

**See:** `docs/00-overview/glossary.md` for the complete glossary.
