---
id: FEATURE-009
title: "Knowledge"
status: canonical
version: "1.0"
owner: "Product Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 2
stability: medium
change_frequency: medium
consumers:
  - Frontend Agent
  - Product Agent
  - AI Agent
depends_on:
  - DOMAIN-004
  - APPLICATION-001
tags:
  - feature
  - knowledge
  - phase-2
---

# FEATURE-009 — Knowledge

## Purpose

Convert experience into reusable, structured knowledge that compounds over time.

## User Value

- Never lose a lesson learned from an interview or rejection
- AI synthesizes unstructured notes into actionable insights
- Knowledge base becomes a personal career library

## Core Capabilities

| Capability | Description |
|---|---|
| **Reflection System** | Structured post-action analysis after interviews/outcomes |
| **Decision Journal** | Record reasoning behind important career decisions |
| **Knowledge Entries** | Reusable structured insights with provenance |
| **AI Synthesis** | Parse unstructured notes into structured knowledge |
| **Research Notes** | Capture and organize research on companies, industries |
| **Knowledge Graph** | Visual connections between knowledge entries, goals, and opportunities |

## Knowledge Types

| Type | Purpose | Trigger |
|---|---|---|
| Reflection | Post-action analysis | Application terminal state |
| Decision Journal | Career decision reasoning | User-initiated |
| Knowledge Entry | Reusable structured insight | AI extraction or manual |
| Research Note | Company/industry research | User-initiated |
| AI Insight | AI-generated observation | System-generated |

## AI Reflection Synthesis (from APPLICATION-001)

When user completes unstructured Reflection after interview/rejection:
- Parses unstructured notes
- Proposes structured updates to Career Capital:
  - New Interview Question added to bank
  - New Skill Gap identified
  - Decision Journal Entry
- User must explicitly approve each before committing

## Business Rules

- KNO-001: Reflections always reference a completed event (INV-007)
- KNO-002: Knowledge Entries never lose provenance (INV-005)
- KNO-003: AI-synthesized insights require user approval before committing
- KNO-004: Reflections are linked to Application, Opportunity, or Goal
- KNO-005: Knowledge Entries can be linked to Goals via KnowledgeGoalLink

## Dependencies

- DOMAIN-004 (Knowledge) — Reflection, KnowledgeEntry, DecisionJournal
- APPLICATION-001 (Intelligence) — Reflection Synthesis, RAG
- APPLICATION-004 (API Layer) — Reflection Router

## Acceptance Criteria

- [ ] User can create Reflections linked to Applications/Opportunities
- [ ] AI synthesizes unstructured notes into structured insights
- [ ] User approves extracted insights before committing
- [ ] Decision Journal captures reasoning with structured fields
- [ ] Knowledge Entries display provenance and source
