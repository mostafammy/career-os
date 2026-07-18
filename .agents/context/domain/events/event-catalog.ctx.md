---
id: DOMAIN-008
title: "Event Catalog"
status: canonical
version: "1.0"
owner: "DDD Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: medium
change_frequency: medium
consumers:
  - All Engineering Agents
  - Automation Agent
  - AI Agent
depends_on:
  - CORE-002
tags:
  - domain
  - events
  - catalog
---

# DOMAIN-008 — Event Catalog

## Purpose

Authoritative catalog of all domain events. Events are the backbone of automation — any automation reasoning requires this module.

## Event Philosophy

- Events are **immutable** business facts
- Events describe the **past** (past tense only)
- Events **never ask questions** — they only announce
- Events live forever — schema may evolve but meaning never changes

## Event Envelope

Every event carries:

| Field | Type | Purpose |
|---|---|---|
| Event ID | string | Unique, immutable |
| Event Name | string | Past tense (OpportunityCaptured) |
| Aggregate ID | string | Entity this happened to |
| Aggregate Type | string | Entity type |
| Occurred At | timestamp | When it happened |
| Actor | string | Who/what caused it |
| Correlation ID | string | Ties events in one journey together |
| Causation ID | string | Which event caused this one |
| Version | integer | Schema version |
| Payload | jsonb | Event-specific data |

## Event Categories

### Lifecycle Events
- OpportunityCaptured, OpportunityClassified, OpportunityResearched, OpportunityScored, OpportunityPrioritized, OpportunityDeferred, OpportunityArchived, OpportunityRestored, OpportunityExpired, OpportunityActioned
- ApplicationCreated, PreparationStarted, ChecklistCompleted, ApplicationSubmitted, InterviewScheduled, InterviewCompleted, OfferReceived, ApplicationAccepted, ApplicationRejected, ApplicationWithdrawn, ApplicationArchived

### Strategy Events
- VisionCreated, MissionCreated, GoalCreated, GoalUpdated, MilestoneCompleted, GoalAchieved, CareerCapitalIncreased, CareerCapitalDecreased

### Knowledge Events
- ReflectionStarted, ReflectionCompleted, LessonCaptured, KnowledgeEntryCreated, DecisionRecorded, DecisionReviewed, InsightGenerated

### Document Events
- DocumentUploaded, DocumentVersionCreated, DocumentApproved, DocumentLinked, DocumentExpired, DocumentArchived

### Calendar Events
- ReminderScheduled, ReminderTriggered, CalendarSynced, InterviewReminderGenerated, DeadlineApproaching, DeadlineMissed

### AI Events
- OpportunitySummarized, RequirementsExtracted, TasksGenerated, EssayReviewed, CVMatched, RecommendationGenerated, ForecastUpdated

### Integration Events
- CalendarConnected, DriveConnected, GitHubConnected, LinkedInConnected, ImportCompleted, ExportGenerated, SynchronizationSucceeded, SynchronizationFailed

### Platform Events
- UserAuthenticated, SessionExpired, NotificationSent, SearchIndexed, BackupCompleted, AuditRecorded

## Event Consumer Map

| Event | Consumers |
|---|---|
| OpportunityCaptured | AI Extraction, Activity Logger |
| OpportunityActioned | Application Factory, Task Generator |
| ApplicationSubmitted | Follow-up Scheduler, Activity Logger |
| ApplicationRejected/Accepted | Reflection Prompter, Analytics |
| ReflectionCompleted | Knowledge Extractor, Career Capital |
| ApplicationInterviewing | Calendar, Activity Logger |

## Correlation ID Pattern

Every user journey produces multiple events tied by a single Correlation ID:
```
Capture → Research → Generate Tasks → Prepare → Submit → Reflection
```
This enables end-to-end journey tracing across the platform.

## Event Versioning Rules

- Never change meaning of existing event
- Add fields, never remove
- New versions only when necessary
- Consumers remain backward compatible

## Career Timeline

Unified chronological projection of all events across the platform. Enables:
- User replays their career journey
- AI reasons over complete history
- Analytics become timeline-based
- Auditing is nearly free

## Canonical Source

`docs/05-engineering/ecs.md`
