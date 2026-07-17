# Domain State Machines

**File:** `docs/03-domain/state-machines.md`

---

# Entity State Machines

**Status:** Canonical
**Version:** 1.0

---

## Purpose
This document defines the strict lifecycle states and valid transitions for the core aggregates in CareerOS. Defining explicit state machines ensures that entities cannot enter invalid states (e.g., an Application cannot be "Accepted" if it hasn't been "Submitted").

---

## 1. Opportunity Lifecycle

An `Opportunity` represents a potential path (a job, grant, scholarship, etc.). Its lifecycle is about capture, evaluation, and decision.

```mermaid
stateDiagram-v2
    [*] --> CAPTURED : Captured via extension/inbox
    
    CAPTURED --> EVALUATING : Begin research
    CAPTURED --> ARCHIVED : Auto-expire or manual dismiss
    
    EVALUATING --> ACTIONED : Decide to apply (Creates Application)
    EVALUATING --> ARCHIVED : Decide not to pursue
    
    ACTIONED --> [*]
    ARCHIVED --> [*]
```

**Domain Rules:**
- **CAPTURED**: The raw entry point. Minimal data is required here.
- **EVALUATING**: The user is actively scoring this against their Goals (Strategy Context).
- **ACTIONED**: A terminal state for the Opportunity itself. Once ACTIONED, the primary lifecycle tracking moves to the child `Application` entity.
- **ARCHIVED**: Soft-deleted. Can be revived later but does not show in active pipelines.

---

## 2. Application Lifecycle

The `Application` is the execution engine. It tracks the actual work done to pursue an Actioned Opportunity.

```mermaid
stateDiagram-v2
    [*] --> DRAFTING : Generated from Actioned Opportunity
    
    DRAFTING --> SUBMITTED : User submits external application
    DRAFTING --> WITHDRAWN : User abandons process
    
    SUBMITTED --> INTERVIEWING : Invited for interview/next round
    SUBMITTED --> REJECTED : Application denied
    SUBMITTED --> WITHDRAWN : User withdraws
    
    INTERVIEWING --> OFFER_RECEIVED : Offer extended
    INTERVIEWING --> REJECTED : Denied post-interview
    INTERVIEWING --> WITHDRAWN : User drops out
    
    OFFER_RECEIVED --> ACCEPTED : Offer signed/accepted
    OFFER_RECEIVED --> DECLINED : User rejects offer
    
    %% Terminal States triggering Reflections
    REJECTED --> [*]
    ACCEPTED --> [*]
    DECLINED --> [*]
    WITHDRAWN --> [*]
```

**Domain Rules:**
- **DRAFTING**: Requires compiling `Documents` and linking `Assets`.
- **SUBMITTED**: The application is out of the user's hands. Triggers follow-up reminders.
- **INTERVIEWING**: Represents any active multi-step process. Generates `Activity` records (e.g., "Technical Interview", "Final Round").
- **Terminal States (REJECTED, ACCEPTED, DECLINED)**: Entering any of these states *must* prompt the user to generate a `Reflection` (Knowledge Context) to ensure Knowledge Compounding.

---

## 3. Goal Lifecycle

A `Goal` defines the strategic direction.

```mermaid
stateDiagram-v2
    [*] --> DRAFT : Defining metrics & milestones
    
    DRAFT --> ACTIVE : Committed to goal
    
    ACTIVE --> COMPLETED : All milestones/metrics met
    ACTIVE --> ABANDONED : Strategy pivot
    
    COMPLETED --> [*]
    ABANDONED --> [*]
```

**Domain Rules:**
- **ACTIVE**: Goals in this state actively influence the scoring of `Opportunities` during the EVALUATING phase.
- **COMPLETED/ABANDONED**: Archived for historical review. Entering these states triggers a high-level Career Reflection.
