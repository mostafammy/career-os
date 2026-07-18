---
id: CORE-004
title: "Product Principles"
status: canonical
version: "1.0"
owner: "PM Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: very-high
change_frequency: extremely-low
consumers:
  - PM Agent
  - UX Agent
  - Feature Agent
  - Review Agent
depends_on:
  - CORE-001
tags:
  - core
  - product
  - always-load
always_loaded: true
---

# CORE-004 — Product Principles

## Core Philosophy

CareerOS is not a task manager. It is not a note-taking app. It is not a CRM. It is a Career Operating System — a platform that helps people make better career decisions, execute opportunities effectively, and continuously learn from experience.

## Principles

| ID | Principle | One-liner |
|---|---|---|
| P-001 | **Optimize for Decisions, Not Data** | Every piece of information must contribute to better decisions. |
| P-002 | **Capture First, Organize Later** | Capture must require minimal effort. Organization happens after. |
| P-003 | **Simplicity is a Competitive Advantage** | Complex systems should feel simple. Progressive disclosure. |
| P-004 | **The User Owns Their Career** | AI augments thinking, never overrides it. Users own all decisions. |
| P-005 | **Build Once, Reuse Everywhere** | Never recreate knowledge that already exists. |
| P-006 | **Knowledge Compounds** | Every completed activity leaves behind reusable knowledge. |
| P-007 | **Everything Has Context** | Every entity explains why it exists, what relates, what's next. |
| P-008 | **One Source of Truth** | Every piece of information has one canonical owner. |
| P-009 | **Design Around Intent** | Interfaces reflect user goals, not system implementation. |
| P-010 | **Trust is the Foundation** | Privacy, transparency, security, reliability — never compromised. |
| P-011 | **Make Progress Visible** | People stay motivated when progress is visible. Avoid vanity metrics. |
| P-012 | **Favor Long-Term Value** | Sustainable solutions over temporary optimizations. |
| P-013 | **Every Screen Should Answer One Question** | Dashboard: "What deserves attention?" Inbox: "What needs processing?" |
| P-014 | **Defaults Should Be Intelligent** | Smart defaults reduce unnecessary decisions. Users can override. |
| P-015 | **Consistency Builds Confidence** | Identical concepts behave identically across the platform. |
| P-016 | **Explain Before You Automate** | Users must know why something happened and which rule triggered it. |
| P-017 | **Optimize for Flow** | Reduce interruptions. Minimize context switching. |
| P-018 | **The Product Learns With the User** | More data = better recommendations, prioritization, automation. |

## Decision Framework

Before introducing any feature, ask:
1. Does it improve career decision-making?
2. Does it reduce cognitive load?
3. Does it increase long-term value?
4. Does it strengthen trust?
5. Does it align with the user's mental model?
6. Does it preserve simplicity?
7. Will this still make sense five years from now?

If "No" to multiple questions, reconsider.

## Anti-Principles

CareerOS intentionally avoids becoming:
- A generic productivity suite
- A social network
- A file storage service
- A replacement for email or calendar
- A generic note-taking app
- A feature collection without strategic coherence

> CareerOS succeeds when users become better at building careers — not better at using CareerOS.

## Canonical Source

`docs/00-overview/product-principles.md`
