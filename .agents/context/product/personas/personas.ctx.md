---
id: ORGANIZATION-001
title: "User Personas"
status: canonical
version: "1.0"
owner: "Product Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: high
change_frequency: low
consumers:
  - Product Agent
  - UX Agent
  - Frontend Agent
  - AI Agent
depends_on:
  - CORE-004
tags:
  - product
  - personas
  - ux
---

# ORGANIZATION-001 — User Personas

## Purpose

Core user personas for CareerOS. All design and product decisions must be evaluated against how well they solve the problems of these specific groups. They share a common trait: ambitious, viewing their career as a continuous, strategic journey.

## Persona 1: The Strategic Starter (Early-Career / Graduate)

**Profile:** Age 20–25, completing education or entering first years of career.

**Goal:** Secure a high-leverage entry-level role, internship, or graduate program.

**Pain Points:**
- Applying to dozens of roles simultaneously across various portals
- Managing chaotic mix of deadlines, cover letters, and company research
- Lacks centralized system — leads to missed deadlines or panicked interview prep
- "Reinvents the wheel" for every application; hasn't learned to reuse assets

**How CareerOS Helps:**
- **Capture:** Clips opportunities from LinkedIn, university portals, company sites
- **Organization:** Single unified pipeline of deadlines and status updates
- **Asset Reusability:** Builds first "Career Capital" database (resumes, standard essay answers)

**Feature Priority:** Capture → Inbox → Opportunities → Documents → Dashboard

---

## Persona 2: The Intentional Pivot (Mid-Career Optimizer)

**Profile:** Age 28–40, established professional looking for strategic shift (promotion, new industry, specialized role).

**Goal:** Quality over quantity. The *right* opportunity, not just *any* opportunity.

**Pain Points:**
- High cost of context switching; demanding day job, limited search time
- Must tailor narrative carefully to leverage existing experience in new context
- Needs to evaluate opportunities against long-term strategic goals, not just salary

**How CareerOS Helps:**
- **Strategic Decision Making:** Decision journals and high-level strategy views for 5-year goal alignment
- **Flow State:** Reduces cognitive load, letting them focus purely on preparation and execution
- **Insight:** Reflection on rejections to adjust narrative for next application

**Feature Priority:** Goals → Strategy → Analytics → Reflections → Knowledge

---

## Persona 3: The Serial Achiever (Fellowships, Grants & Academia)

**Profile:** Researchers, academics, creatives, non-profit leaders. Varies in age.

**Goal:** Continuously secure funding, speaking engagements, scholarships, or residencies.

**Pain Points:**
- State of perpetual application
- Massive repository of past proposals, personal statements, bios scattered across Google Docs
- Missing a grant deadline sets work back by an entire year

**How CareerOS Helps:**
- **Knowledge Compounding:** Ultimate library of reusable knowledge — instantly pull up past fellowship proposals
- **Reliability:** Never forgets a deadline; ensures no missed crucial funding cycles
- **Confidence:** Complete control of professional pipeline, reducing anxiety of constant hustle

**Feature Priority:** Knowledge → Documents → Calendar → Opportunities → Analytics

---

## Persona Alignment Checklist

When proposing a new feature, ask:
1. Does this help **The Strategic Starter** manage chaos and learn to reuse assets?
2. Does this help **The Intentional Pivot** make strategic decisions quickly with low cognitive load?
3. Does this help **The Serial Achiever** securely store and instantly retrieve their compounding career knowledge?

If a feature does not serve at least one persona, it should not be built.

## Canonical Source

`docs/01-product/user-personas.md`
