---
id: PROMPT-002
title: "Task Prompts"
status: canonical
version: "1.0"
owner: "Prompt Engineering Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: medium
change_frequency: medium
confidence: 1.0
source_of_truth: ".agents/context/application/prompts/task-prompts.ctx.md"
consumers:
  - AI Agent
  - Prompt Engineering Agent
  - Backend Agent
depends_on:
  - PROMPT-001
  - PROMPT-004
  - APPLICATION-001
tags:
  - application
  - prompts
  - tasks
always_loaded: false
token_budget: 1200
---

# PROMPT-002 — Task Prompts

## Purpose

Per-task user/developer prompt templates that bind inputs to PROMPT-004 schemas. Keep thin; system constraints live in PROMPT-001.

## Template Conventions

```
TASK: <capability>
INPUTS: <typed blocks>
CONSTRAINTS: <task-local only>
OUTPUT: <schema ref>
```

## Templates

### T-CAPTURE-001 — Parse Capture Payload

```
TASK: intelligent_capture
INPUTS:
  raw_text: {{raw_text}}
  source_url: {{source_url | optional}}
  locale: {{locale | default en}}
CONSTRAINTS:
  - Extract only evidenced fields
  - Prefer ISO dates
  - required_documents as array of strings
OUTPUT: AiResult<IntelligentCaptureData> per PROMPT-004
```

### T-FIT-001 — Score Opportunity Fit

```
TASK: strategic_fit
INPUTS:
  opportunity: {{opportunity_json}}
  active_goals: {{goals_json}}
  career_capital_summary: {{capital_json}}
CONSTRAINTS:
  - Link each rationale to goal_id or capital signal when possible
  - fit ∈ {High, Medium, Low}
OUTPUT: AiResult<StrategicFitData>
```

### T-ASSET-001 — Suggest Assets

```
TASK: asset_suggestion
INPUTS:
  opportunity: {{opportunity_json}}
  candidate_assets: {{assets_json}}  # only user-owned
  k: 3
CONSTRAINTS:
  - Rank ≤ k
  - why must reference opportunity requirement
OUTPUT: AiResult<AssetSuggestionData>
```

### T-DOC-001 — Generate Document Draft

```
TASK: document_generation
INPUTS:
  document_type: {{cover_letter | resume_tailoring}}
  opportunity: {{opportunity_json}}
  career_capital: {{capital_json}}
  tone: {{tone | optional}}
CONSTRAINTS:
  - No ungrounded skills/experiences
  - Segment all prose as generated:true
  - user_review_required must be true
OUTPUT: AiResult<DocumentGenerationData>
```

### T-REFLECT-001 — Synthesize Reflection

```
TASK: reflection_synthesis
INPUTS:
  reflection_text: {{text}}
  related_application_id: {{id | optional}}
CONSTRAINTS:
  - Proposals only; no persistence
  - Each item needs evidence_span
OUTPUT: AiResult<ReflectionSynthesisData>
```

## Developer-Agent Task Prompts (Build-Time)

These guide coding agents, not end-user AI:

### T-DEV-DOMAIN — Implement Domain Change

```
Load: CORE-*, ROADMAP-001, relevant DOMAIN-*, APP-005/006
Respect: XAG rules, FSM transitions, no infrastructure in domain layer
Deliver: entities/commands/tests + event updates
Authority: peer-review; human if invariant change
```

### T-DEV-AI — Implement AI Capability Wiring

```
Load: APP-001, APP-006, PROMPT-001/002/004, DOMAIN-002/003/004
Respect: proposal-only writes; output contract validation
Deliver: service + schema parse + eval hooks
Authority: peer-review; human if new capability
```

## Versioning

Task prompt IDs are stable. Breaking input field renames require major version note in prompt_version registry.

## Canonical Source

APPLICATION-001 capability triggers + PROMPT-004 schemas.
