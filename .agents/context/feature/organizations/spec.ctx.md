---
id: FEATURE-005
title: "Organizations"
status: canonical
version: "1.0"
owner: "Product Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 2
stability: medium
change_frequency: low
consumers:
  - Frontend Agent
  - Product Agent
  - DDD Agent
depends_on:
  - DOMAIN-005
  - DOMAIN-002
  - DOMAIN-003
tags:
  - feature
  - organizations
  - phase-2
---

# FEATURE-005 — Organizations

## Purpose

Manage external institutions and build institutional knowledge over time.

## User Value

- Track all interactions with a single organization across multiple opportunities
- Build institutional knowledge (response times, success rates, culture notes)
- Automatic linking when new opportunities match existing organizations

## Core Capabilities

| Capability | Description |
|---|---|
| **Organization Workspace** | Unified view: opportunities, applications, contacts, timeline, analytics |
| **Auto-Linking** | New opportunities auto-link to existing organizations by domain/name |
| **Contact Management** | Link contacts to organizations (Phase 2 entity) |
| **Historical View** | All past opportunities and applications for an organization |
| **Analytics** | Success rate, average response time, relationship strength |

## Organization Workspace Tabs

| Tab | Content |
|---|---|
| Overview | Organization details, industry, website |
| Applications | All applications to this organization |
| Opportunities | All opportunities from this organization |
| Contacts | Linked contacts (Phase 2) |
| Documents | Documents associated with this organization |
| Timeline | Chronological activity feed |
| Analytics | Success rate, response time, relationship metrics |
| Notes | Free-form notes about the organization |
| History | State transitions and changes |

## Business Rules

- ORG-001: Organization name + domain uniqueness enforced
- ORG-002: Deleting an Organization archives but does not delete linked Opportunities/Applications
- ORG-003: Contact email domain auto-matches to Organization
- ORG-004: Documents uploaded to Applications auto-tag with Organization name

## Dependencies

- DOMAIN-005 (Organization) — Entity and relationships
- DOMAIN-002 (Opportunity) — Opportunity → Organization link
- DOMAIN-003 (Application) — Application → Organization link
- APPLICATION-002 (Automation) — Organizational automations

## Acceptance Criteria

- [ ] Organization workspace shows all tabs with correct data
- [ ] New opportunities auto-link to existing organizations
- [ ] Historical opportunities and applications display correctly
- [ ] Contact email domain matches to organization
