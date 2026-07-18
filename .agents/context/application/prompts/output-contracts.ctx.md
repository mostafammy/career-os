---
id: PROMPT-004
title: "AI Output Contracts"
status: canonical
version: "1.0"
owner: "Prompt Engineering Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: high
change_frequency: medium
confidence: 1.0
source_of_truth: ".agents/context/application/prompts/output-contracts.ctx.md"
consumers:
  - AI Agent
  - Prompt Engineering Agent
  - Backend Agent
  - Testing Agent
depends_on:
  - APPLICATION-001
  - CORE-002
  - APPLICATION-006
tags:
  - application
  - prompts
  - contracts
  - ai
always_loaded: false
token_budget: 1600
co_load:
  - APPLICATION-001
  - CORE-002
---

# PROMPT-004 — AI Output Contracts

## Purpose

Prompts are production assets. Structured output contracts make AI results validatable, testable, and safe to wire into domain commands.

## Global Output Rules (All Capabilities)

| Rule | Requirement |
|---|---|
| OC-001 | JSON (or typed object) matching schema; no freeform when schema defined |
| OC-002 | Every factual claim must be grounded in provided context or marked `ungrounded: true` |
| OC-003 | Never invent skills, employers, dates, metrics, or credentials |
| OC-004 | Always include `explanation` / `rationale` for recommendations |
| OC-005 | Always include `confidence` in `[0,1]` |
| OC-006 | Mark AI-generated prose with `generated: true` segments where applicable |
| OC-007 | Never auto-commit domain mutations; return **proposals** only |
| OC-008 | Use CORE-002 terminology only (Opportunity, Application, Reflection, …) |
| OC-009 | On insufficient context: return `status: "needs_input"` not a guess |
| OC-010 | No PII exfiltration beyond user-owned session data |

## Shared Envelope

```typescript
type AiResult<T> = {
  status: "ok" | "needs_input" | "refused" | "error";
  capability: AiCapabilityId;
  confidence: number; // 0..1
  explanation: string;
  data: T | null;
  warnings: string[];
  ungrounded_claims: string[]; // must be empty in production happy path
  model: string;
  prompt_version: string;
  correlation_id: string;
};
```

## Capability Contracts

### 1. Intelligent Capture — `intelligent_capture`

```typescript
type IntelligentCaptureData = {
  draft: {
    title: string;
    organization_name?: string;
    role_title?: string;
    application_deadline?: string; // ISO date if known
    location?: string;
    salary_range?: string;
    source_url?: string;
    required_documents: string[];
  };
  field_provenance: Array<{
    field: string;
    source_span: string; // exact excerpt
    confidence: number;
  }>;
  missing_fields: string[];
};
```

**Failure examples:** Inventing salary when absent; mapping wrong org; auto-saving without user review.

### 2. Strategic Fit Scoring — `strategic_fit`

```typescript
type StrategicFitData = {
  fit: "High" | "Medium" | "Low";
  score_rationale: Array<{
    type: "aligns" | "gap" | "risk" | "neutral";
    statement: string;
    linked_goal_id?: string;
    linked_capital_signal?: string;
  }>;
  dimensions_touched: string[]; // subset of Opportunity Score dimensions
};
```

**Failure examples:** Score without linking goals; inventing Career Capital the user lacks.

### 3. Asset Suggestion — `asset_suggestion`

```typescript
type AssetSuggestionData = {
  suggestions: Array<{
    rank: 1 | 2 | 3;
    document_id?: string;
    knowledge_entry_id?: string;
    title: string;
    why: string; // provenance sentence
    similarity_note: string;
  }>; // max 3
};
```

**Failure examples:** Suggesting documents not in user corpus; empty `why`.

### 4. Document Generation — `document_generation`

```typescript
type DocumentGenerationData = {
  document_type: "cover_letter" | "resume_tailoring" | "other";
  segments: Array<{
    text: string;
    generated: true;
    grounded_facts: string[]; // ids or fact strings from Career Capital
  }>;
  disallowed_content_check: {
    invented_skills: string[]; // must be []
    invented_experiences: string[]; // must be []
  };
  user_review_required: true;
};
```

**Failure examples:** Adding “fluent in Japanese” when not in capital; unmarked generated text.

### 5. Reflection Synthesis — `reflection_synthesis`

```typescript
type ReflectionSynthesisData = {
  proposals: Array<{
    kind: "interview_question" | "skill_gap" | "decision_journal" | "knowledge_entry";
    payload: Record<string, unknown>;
    evidence_span: string;
    requires_user_approval: true;
  }>;
};
```

**Failure examples:** Writing proposals directly to Knowledge DB; fabricating skill gaps not in notes.

## Refusal Contract

```typescript
// status: "refused"
type RefusalData = {
  reason_code:
    | "insufficient_context"
    | "ethical_constraint"
    | "security_constraint"
    | "out_of_scope"
    | "phase_deferred";
  message: string;
  safe_fallback: string;
};
```

## Versioning

| Field | Rule |
|---|---|
| `prompt_version` | Semver string per capability prompt file |
| Breaking schema change | Major bump; update evals + backend parsers |
| Non-breaking field add | Minor bump |
| Wording-only prompt change | Patch bump + smoke eval |

## Validation Checklist (Runtime)

- [ ] Parses as schema
- [ ] `ungrounded_claims` empty OR status ≠ ok
- [ ] Terminology check vs CORE-002
- [ ] No domain commit flags
- [ ] `confidence` present
- [ ] Capability-specific required fields present

## Canonical Source

APPLICATION-001 capabilities + Principal Review (Prompt / Output Contract gap).
