# Feature Deferral Registry

**File:** `docs/01-product/deferral-registry.md`

---

# Feature Deferral Registry

**Status:** Canonical
**Version:** 1.0

---

## Purpose

This document tracks features and capabilities that are explicitly **deferred** from the CareerOS Private Alpha. Items are listed here to prevent scope creep and provide a clear roadmap for future phases.

**Rule:** If a feature is not listed in `docs/01-product/PRD.md` §11.1 (In Scope), it is deferred. This registry documents what was deferred and why.

---

## Deferred Features

### Career Capital Scoring

| Field | Value |
|---|---|
| Description | Automated scoring and tracking of career capital accumulation across Knowledge, Skills, Credentials, Portfolio, Network, Reputation, Experience |
| Target Phase | Phase 2 |
| Reason | Requires substantial Knowledge Context data to produce meaningful scores. Premature in alpha. |
| Dependencies | Knowledge Context maturity, sufficient reflection data |

### Decision Engine (10-Dimension Evaluation)

| Field | Value |
|---|---|
| Description | Multi-dimensional opportunity evaluation framework with configurable scoring weights |
| Target Phase | Phase 2 |
| Reason | Over-engineered for single-user alpha. Basic manual prioritization is sufficient. |
| Dependencies | Goal system maturity, user calibration data |

### Knowledge Graph

| Field | Value |
|---|---|
| Description | Graph-based representation of relationships between knowledge entries, opportunities, goals, and organizations |
| Target Phase | Phase 3 |
| Reason | Requires production RAG infrastructure and substantial knowledge base. |
| Dependencies | Vector database, embedding pipeline, knowledge entry volume |

### Analytics Engine (Advanced)

| Field | Value |
|---|---|
| Description | Predictive analytics, trend analysis, forecasting, recommendation analytics |
| Target Phase | Phase 3 |
| Reason | Requires historical data volume that does not exist in alpha. |
| Dependencies | 6+ months of operational data, statistical models |

### Enterprise Features (SSO, RBAC, Multi-Tenant)

| Field | Value |
|---|---|
| Description | Single Sign-On, Role-Based Access Control, multi-tenant workspace isolation |
| Target Phase | Phase 6 |
| Reason | Single-user alpha does not require authorization complexity. |
| Dependencies | Multi-user architecture, team features |

### External Integrations (Most)

| Field | Value |
|---|---|
| Description | Google Calendar, Outlook, Gmail, Google Drive, GitHub, LinkedIn, Research databases |
| Target Phase | Phase 3-4 |
| Reason | Core workflow must be validated before adding integration complexity. |
| Dependencies | Core workflow stability, OAuth infrastructure |

### Browser Extension

| Field | Value |
|---|---|
| Description | Chrome/Firefox extension for one-click opportunity capture from any website |
| Target Phase | Phase 2 |
| Reason | Manual capture is sufficient for alpha validation. |
| Dependencies | Content script architecture, website parsing heuristics |

### Collaboration Features

| Field | Value |
|---|---|
| Description | Shared workspaces, team features, comments, permissions |
| Target Phase | Phase 5 |
| Reason | Single-user alpha. No collaboration need. |
| Dependencies | Multi-user architecture |

### Mobile Applications

| Field | Value |
|---|---|
| Description | Native iOS and Android applications |
| Target Phase | Phase 5 |
| Reason | Responsive web is sufficient for alpha. |
| Dependencies | React Native or PWA evaluation |

### Public Opportunity Marketplace

| Field | Value |
|---|---|
| Description | Aggregated opportunity listings from external sources |
| Target Phase | Phase 4 |
| Reason | Discovery remains user-driven in alpha. |
| Dependencies | Web scraping infrastructure, opportunity data schema |

---

## Phase Mapping

| Phase | Name | Timeline | Key Additions |
|---|---|---|---|
| Phase 0 | No-Code MVP | Month 0 | Validate concept with existing tools |
| Phase 1 | Web MVP | Months 1-3 | Core workflow: Capture, Organize, Execute, Dashboard, Calendar, Search |
| Phase 2 | Intelligence | Months 4-6 | Browser extension, Career Capital scoring, Decision Engine basics, background jobs |
| Phase 3 | Automation | Months 7-9 | Event bus, advanced automation, Knowledge Graph, integrations (Calendar, Drive) |
| Phase 4 | Platform | Months 10-12 | Public marketplace, advanced analytics, LinkedIn integration |
| Phase 5 | Collaboration | Year 2 | Multi-user, teams, mobile apps |
| Phase 6 | Enterprise | Year 2+ | SSO, RBAC, multi-tenant |

---

## Review Cycle

This registry is reviewed at the end of each phase. Items may be promoted, reprioritized, or removed based on:
- User feedback from daily usage
- Technical feasibility assessments
- Business value re-evaluation
