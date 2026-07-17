EVENT CATALOG SPECIFICATION (ECS)

Version: 1.0
Status: Principal Architecture Draft

1. Purpose

The Event Catalog defines every meaningful business event that can occur within CareerOS.

Events are the primary mechanism through which engines communicate.

They describe completed business facts, never intentions.

2. Event Philosophy
Events are immutable.

Bad:

Opportunity Changed

Good:

Opportunity Archived
Events describe the past.

Bad:

Archive Opportunity

That's a command.

Good:

Opportunity Archived

That's a fact.

Events never ask questions.

They only announce.

3. Event Taxonomy

Every event belongs to exactly one category.

Lifecycle

Workflow

Knowledge

Strategy

Analytics

Platform

Integration

Automation

AI
4. Event Metadata

Every event shares a common envelope.

Event ID

Event Name

Aggregate ID

Aggregate Type

Occurred At

Actor

Correlation ID

Causation ID

Version

Payload

This allows every engine to process events consistently.

5. Opportunity Events
OpportunityCaptured

OpportunityClassified

OpportunityResearched

OpportunityScored

OpportunityPrioritized

OpportunityDeferred

OpportunityArchived

OpportunityRestored

OpportunityExpired

OpportunityCompleted

Notice there is no generic:

Opportunity Updated

Specificity matters.

6. Application Events
ApplicationCreated

PreparationStarted

ChecklistCompleted

ApplicationSubmitted

InterviewScheduled

InterviewCompleted

OfferReceived

ApplicationAccepted

ApplicationRejected

ApplicationWithdrawn

ApplicationArchived

Every stage becomes observable.

7. Strategy Events
VisionCreated

MissionCreated

GoalCreated

GoalUpdated

MilestoneCompleted

CareerCapitalIncreased

CareerCapitalDecreased

GoalAchieved
8. Knowledge Events
ReflectionStarted

ReflectionCompleted

LessonCaptured

KnowledgeEntryCreated

DecisionRecorded

DecisionReviewed

InsightGenerated

Notice:

Knowledge grows through events.

9. Document Events
DocumentUploaded

DocumentVersionCreated

DocumentApproved

DocumentLinked

DocumentExpired

DocumentArchived
10. Calendar Events
ReminderScheduled

ReminderTriggered

CalendarSynced

InterviewReminderGenerated

DeadlineApproaching

DeadlineMissed
11. AI Events
OpportunitySummarized

RequirementsExtracted

TasksGenerated

EssayReviewed

CVMatched

RecommendationGenerated

ForecastUpdated

AI never changes the domain directly.

It produces knowledge.

12. Integration Events
CalendarConnected

DriveConnected

GitHubConnected

LinkedInConnected

ImportCompleted

ExportGenerated

SynchronizationSucceeded

SynchronizationFailed
13. Platform Events
UserAuthenticated

SessionExpired

NotificationSent

SearchIndexed

BackupCompleted

AuditRecorded
14. Event Consumers

Here's where the architecture becomes elegant.

Example:

ApplicationSubmitted

Who cares?

Analytics Engine

Knowledge Engine

Notification Platform

Calendar

Decision Engine

Automation Engine

The Application Engine doesn't know or care who is listening.

It simply publishes the fact.

15. Correlation

Consider this workflow:

Capture Opportunity

↓

Research Opportunity

↓

Generate Tasks

↓

Prepare Application

↓

Submit

↓

Reflection

Those are many events, but one overarching journey.

A Correlation ID ties them together so you can trace the complete workflow across the platform.

16. Event Versioning

Events live forever.

Their schema may evolve.

Rules:

Never change the meaning of an existing event.
Add fields instead of removing them.
Introduce new versions only when necessary.
Consumers should remain backward compatible where practical.
17. Event Ordering

Not every event has a global order.

Instead:

Events are ordered within an aggregate.
Different aggregates may progress independently.
Consumers must not assume cross-aggregate ordering.

This prevents fragile coupling.

18. Event Retention

Business events are part of the platform's historical record.

Policies:

Preserve auditability.
Archive when appropriate.
Never silently discard business-critical events.
Make retention configurable where regulations require it.
19. Event Principles
Facts are immutable.
Events are business language.
Events should be meaningful to non-engineers.
Every event has a clear owner.
Every event can be traced.
Every event is documented.





🌟 Principal Architect Review — The Biggest Leap Yet

Now comes the idea that, in my opinion, would make CareerOS feel like a platform designed for the next decade.

Introduce the "Career Timeline"

Most systems store:

Activities
Notifications
Audit logs
History
Calendar events

...as separate concepts.

I wouldn't.

I would unify them into a single chronological stream.

Career Timeline

──────────────────────────────

2028-03-12

Opportunity Captured

──────────────────────────────

2028-03-15

Requirements Extracted

──────────────────────────────

2028-03-18

Preparation Started

──────────────────────────────

2028-03-25

Application Submitted

──────────────────────────────

2028-04-04

Interview Completed

──────────────────────────────

2028-04-06

Reflection Completed

──────────────────────────────

2028-04-08

Career Capital +5

──────────────────────────────

Everything becomes part of one unified narrative.

That has huge benefits:

A user can replay their career journey.
AI can reason over a complete history.
Analytics become timeline-based.
Auditing becomes almost free.
Debugging becomes much easier.
Future visualizations become richer.

In practice, different underlying systems may still store events, notifications, and audit records differently for performance and operational reasons. The Career Timeline is the conceptual projection that unifies them into a single user-facing experience.
