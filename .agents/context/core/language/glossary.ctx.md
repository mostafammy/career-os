---
id: CORE-002
title: "Ubiquitous Language (Glossary)"
status: canonical
version: "1.0"
owner: "DDD Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: high
change_frequency: low
consumers:
  - All Agents
depends_on:
  - CORE-001
tags:
  - core
  - glossary
  - always-load
always_loaded: true
---

# CORE-002 — Ubiquitous Language

Every term below has ONE canonical meaning. All agents, code, UI, and AI prompts must use these exact terms.

## Canonical Terms

| Term | Definition |
|---|---|
| **Opportunity** | A potential career advancement worth evaluating (internship, scholarship, fellowship, hackathon, conference, competition, job, research position). Never say "Job Post" or "Listing". |
| **Application** | A concrete submission made in response to a single Opportunity. Never say "Submission". |
| **Organization** | An external institution offering Opportunities (university, company, NGO, research institute). Never say "Company" unless specifically a company. |
| **Goal** | A measurable objective supporting one or more long-term Missions. |
| **Mission** | A strategic objective composed of multiple Goals. |
| **Milestone** | A measurable checkpoint contributing toward Goal completion. |
| **Vision** | The highest-level aspiration guiding all strategic planning. |
| **Reflection** | A structured analysis performed after a meaningful experience. Converts experience into reusable knowledge. |
| **Knowledge Entry** | A reusable piece of structured knowledge derived from experience, reflection, or research. Never say "Note". |
| **Decision Journal** | A structured record capturing the reasoning behind important career decisions. |
| **Career Capital** | The measurable collection of assets that increase long-term career opportunities. |
| **Document** | A reusable asset supporting applications: CV, Passport, Portfolio, Transcript, Recommendation Letter, Essay, Certificate. |
| **Inbox** | A temporary holding area where newly captured opportunities await classification. |
| **Workspace** | The primary interface for interacting with a single domain entity. Never say "Details Page". |
| **Activity** | An immutable record describing something that has already happened. Append-only audit trail. |
| **Domain Event** | An immutable business fact describing something that has already occurred. Past tense only. |
| **Command** | A request expressing user intent to change the system. |
| **Query** | A request for information that never changes system state. |
| **Engine** | A logical subsystem responsible for one major business capability. |
| **Entity** | A uniquely identifiable business object with its own lifecycle. |
| **Timeline** | A chronological representation of significant activities, events, and milestones. |
| **Task** | A concrete action required to progress an Opportunity, Application, or Goal. |
| **Reminder** | A scheduled notification intended to prompt future action. |
| **Projection** | A read-optimized representation derived from one or more domain events. |
| **Workflow** | A coordinated sequence of business activities leading toward a specific outcome. |

## Canonical Relationship Map

```
Vision → Mission → Goal → Milestone → Opportunity → Application → Reflection → Knowledge Entry

Organization ────────────┐
Document ────────────────┤
Task ────────────────────┤
Timeline ────────────────┤
Activity ────────────────┤
Analytics ───────────────┘
```

## Naming Rules

- Use **Opportunity**, never "Job Post" or "Listing"
- Use **Application**, never "Submission"
- Use **Organization**, not "Company" (unless specifically a company)
- Use **Workspace**, not "Details Page"
- Use **Knowledge Entry**, not "Note"
- Use **Activity** for historical records
- Use **Event** for immutable business facts
- Use **Command** for user intent
- Use **Query** for read-only operations
- Use **Engine** for architectural modules
- Use **Aggregate** only in architecture docs, never in UI

## Canonical Source

`docs/00-overview/glossary.md`
