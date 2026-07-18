---
id: FEATURE-012
title: "AI Assistant"
status: canonical
version: "1.0"
owner: "Product Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 3
stability: medium
change_frequency: medium
consumers:
  - Frontend Agent
  - Product Agent
  - AI Agent
depends_on:
  - APPLICATION-001
  - APPLICATION-006
  - DOMAIN-004
tags:
  - feature
  - ai-assistant
  - phase-3
---

# FEATURE-012 — AI Assistant

## Purpose

Intelligent recommendations and insights across the entire career workflow.

## User Value

- Reduce cognitive load with AI-powered suggestions
- Make better decisions with data-driven recommendations
- Compound knowledge faster through automated synthesis

## Core Capabilities

| Capability | Source | Description |
|---|---|---|
| **Intelligent Capture** | APPLICATION-001 | Parse URLs/text into structured Opportunities |
| **Strategic Fit Scoring** | APPLICATION-001 | Score opportunities against Goals |
| **Asset Suggestion** | APPLICATION-001 | RAG over past documents for new applications |
| **Document Generation** | APPLICATION-001 | Draft cover letters from Career Capital |
| **Reflection Synthesis** | APPLICATION-001 | Parse unstructured notes into structured knowledge |
| **Conversational Interface** | Phase 3 | Chat-based interaction with career data |

## AI Principles (from CORE-004)

- **P-004:** AI must augment human judgment, never override it
- **P-016:** Explain Before You Automate — all AI outputs must be explainable

## Security Rules (co-loaded with APPLICATION-006)

- NEVER load AI features without security context
- AI processes confidential career data — privacy rules mandatory
- NEVER fabricate skills or experiences
- ALWAYS flag AI-generated content
- User approval required for all AI-generated knowledge commits

## User Flows

### Flow 1: Capture & Extract
1. User pastes URL or text
2. AI extracts structured fields
3. User reviews and edits
4. User saves as Opportunity

### Flow 2: Evaluate & Score
1. User opens Opportunity in EVALUATING
2. AI compares against active Goals
3. AI returns Fit Score with reasoning
4. User makes final decision

### Flow 3: Draft & Generate
1. User requests cover letter draft
2. AI retrieves relevant Career Capital
3. AI generates first draft (flagged sentences)
4. User reviews and edits in their voice

### Flow 4: Reflect & Synthesize
1. User brain-dumps interview notes
2. AI parses and proposes structured insights
3. User approves/rejects each insight
4. Approved insights commit to Knowledge base

## Business Rules

- AI-001: All AI outputs must be explainable (reasoning bullets required)
- AI-002: AI-generated content is always flagged in the UI
- AI-003: User must explicitly approve AI-extracted knowledge before committing
- AI-004: AI is barred from fabricating skills or experiences
- AI-005: Rate limit: 50 AI requests per hour per user

## Dependencies

- APPLICATION-001 (Intelligence) — All AI capabilities
- APPLICATION-006 (Security) — Privacy and security rules
- DOMAIN-004 (Knowledge) — Knowledge base for RAG
- DOMAIN-001 (Strategy) — Goals for scoring alignment

## Acceptance Criteria

- [ ] AI extraction works for URL and text input
- [ ] Fit Score displays with reasoning bullets
- [ ] Asset suggestion surfaces relevant past documents
- [ ] Document generation uses only Career Capital facts
- [ ] All AI outputs are explainable and flagged
