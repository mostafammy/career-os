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

🌟 Principal Architect Review — Here's How I'd Push It to Google-Level

Daphi, this is already a strong conceptual model, but I'd introduce one more architectural layer that I've seen pay dividends on long-lived systems:

Introduce a Domain Context Map

Right now, CareerOS is one large domain. As it grows, that's risky.

Instead, divide it into Bounded Contexts (a core Domain-Driven Design concept).

                    CareerOS
                         │
 ┌───────────────────────┼────────────────────────┐
 │                       │                        │
 ▼                       ▼                        ▼
Strategy Context     Opportunity Context    Knowledge Context
(Vision, Goals)      (Inbox, Apps)          (Reflections, AI)
 │                       │                        │
 └──────────────┐        │        ┌───────────────┘
                ▼        ▼        ▼
             Integration Context
      (Calendar, Email, Drive, GitHub)
                │
                ▼
         Platform Context
 (Identity, Notifications, Search, Settings)

Each context owns its language, rules, and models.

For example:

Strategy Context knows about Missions, Goals, and Career Capital.
Opportunity Context knows about Opportunities and Applications.
Knowledge Context knows about Reflections and Decision Journals.
Platform Context knows nothing about careers—it only provides shared services.

This separation makes the system dramatically easier to evolve, allows teams to work independently in the future, and keeps the domain model from becoming an unmanageable monolith.
