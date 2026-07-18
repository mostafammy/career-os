---
id: FEATURE-006
title: "Documents"
status: canonical
version: "1.0"
owner: "Product Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: high
change_frequency: low
consumers:
  - Frontend Agent
  - Product Agent
  - AI Agent
depends_on:
  - DOMAIN-006
tags:
  - feature
  - documents
  - phase-1
---

# FEATURE-006 — Documents

## Purpose

Store, version, and reuse career assets across opportunities and applications.

## User Value

- Single source of truth for all career documents (CV, essays, certificates)
- Version control ensures no lost work
- AI-powered asset suggestion surfaces relevant past documents

## Core Capabilities

| Capability | Description |
|---|---|
| **Document Library** | Browse, filter, search all documents by type, tag, status |
| **Version Control** | Create new versions; view full version history |
| **Link to Opportunity** | Associate documents with requirements (optional/required) |
| **Pin to Application** | Pin specific document versions to applications |
| **AI Suggestion** | Surface relevant past documents when drafting new applications |
| **Expiration Tracking** | Track document expiry (passports, certificates) |

## Document Types

CV, Passport, Essay, Recommendation Letter, Portfolio, Certificate, Transcript, Cover Letter, Other

## Document Workspace Tabs

| Tab | Content |
|---|---|
| Overview | Document metadata, type, status, tags |
| Versions | Version history with diff view |
| Usage | Which opportunities/applications use this document |
| History | Upload and modification history |
| Related Opportunities | Opportunities requiring this document type |
| Analytics | Usage count, reuse rate |

## Business Rules

- DOC-001: Max 10MB per file
- DOC-002: Allowed MIME: PDF, DOCX, DOC, TXT, PNG, JPG, JPEG
- DOC-003: Server-generated filenames (never user-provided)
- DOC-004: Storage path: `documents/{user_id}/{doc_id}/v{version}/{server_generated_name}`
- DOC-005: Pre-signed URLs with 1-hour expiry
- DOC-006: Documents cannot be deleted if still linked to active Applications
- DOC-007: Documents remain versioned (INV-008)

## Domain Events

DocumentUploaded, DocumentVersioned, DocumentLinked, DocumentUnlinked, DocumentExpired

## Dependencies

- DOMAIN-006 (Document) — Entity, lifecycle, relationships
- APPLICATION-001 (Intelligence) — Asset Suggestion Engine (RAG)
- APPLICATION-004 (API Layer) — Document Router
- APPLICATION-006 (Security) — File upload security rules

## Acceptance Criteria

- [ ] Document library displays all documents with type/tag filtering
- [ ] Version history shows all versions with timestamps
- [ ] Documents can be linked to opportunities and pinned to applications
- [ ] AI surfaces relevant past documents when drafting
- [ ] Expiration tracking alerts for expiring documents
