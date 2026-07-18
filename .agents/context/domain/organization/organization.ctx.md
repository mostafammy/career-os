---
id: DOMAIN-005
title: "Organization Domain"
status: canonical
version: "1.0"
owner: "DDD Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: high
change_frequency: low
consumers:
  - DDD Agent
  - Backend Agent
depends_on:
  - CORE-002
  - CORE-003
tags:
  - domain
  - organization
---

# DOMAIN-005 — Organization Domain

## Purpose

Define the Organization aggregate and its relationships. Organization is a **supporting aggregate** — thin module, relatively independent.

## Entity: Organization

**Purpose:** Represents an external institution offering Opportunities.
**Examples:** University, Company, NGO, Research Institute, Government Agency

### Attributes

| Attribute | Type | Notes |
|---|---|---|
| name | text | Required |
| industry | text | Optional |
| website | text | Optional |
| notes | text | Free-form |

### Computed Properties

- **Historical Success Rate:** percentage of Applications that resulted in ACCEPTED
- **Relationship Strength:** derived from number of interactions
- **Average Response Time:** average days between submission and response
- **Career Capital Contribution:** derived from associated Opportunities

### Relationships

| Relationship | Target | Cardinality |
|---|---|---|
| Owned by | User | N:1 |
| Publishes | Opportunity | 1:N |
| Has | Application | 1:N (denormalized) |
| Has | Contact | 1:N (Phase 2) |
| Has | Knowledge | 1:N |
| Has | Analytics | 1:N |

### Business Rules

- Organization auto-linking: when Opportunity is created with matching domain/name, auto-link to existing Organization
- Organization is independent — deleting Organization does NOT delete Opportunities or Applications (reference relationship, not ownership)

## Domain Events

OrganizationCreated, OrganizationUpdated, OrganizationLinked

## Phase 1 Scope

- Basic CRUD for Organizations
- Auto-linking from Opportunity capture
- Organization list with computed properties

## Phase 2+ Deferred

- Contact entity (CRM-like features explicitly OUT of scope per product anti-principles)
- Organization analytics dashboard
- Relationship strength scoring

## Canonical Source

`docs/03-domain/entities.md` (§21.3)
