---
id: DOMAIN-006
title: "Document Domain"
status: canonical
version: "1.0"
owner: "DDD Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: medium-high
change_frequency: low
consumers:
  - DDD Agent
  - Backend Agent
  - Frontend Agent
depends_on:
  - CORE-002
  - CORE-003
tags:
  - domain
  - document
  - versioning
---

# DOMAIN-006 — Document Domain

## Purpose

Define the Document aggregate including versioning and link tables. Documents are **reusable career assets** with version history and link semantics.

## Entity: Document

**Purpose:** Reusable asset supporting one or more Applications or Opportunities.
**Examples:** CV, Passport, Essay, Portfolio, Transcript, Certificate, Recommendation Letter

### Attributes

| Attribute | Type | Notes |
|---|---|---|
| title | text | Required |
| type | text | CV, Passport, Essay, etc. |
| status | document_status | ACTIVE, EXPIRED, ARCHIVED |
| file_url | text | Storage URL |
| file_size | integer | Bytes |
| mime_type | text | PDF, DOCX, etc. |
| version | integer | Version counter, starts at 1 |
| tags | text[] | Searchable |
| expires_at | timestamp | Optional expiration |
| deleted_at | timestamp | Soft delete |

### Computed Properties

- **Version Count:** total versions
- **Reuse Count:** number of times linked to Applications/Opportunities
- **Expiration Status:** expired or active

### Business Rules

- **INV-008:** Documents remain versioned — new versions don't replace old ones
- **Deletion Rule:** "Prevent if still referenced" — cannot delete if linked to active Application
- **Storage Path:** `documents/{user_id}/{doc_id}/v{version}/{server_generated_name}`
- **MIME Whitelist:** PDF, DOCX, DOC, TXT, PNG, JPG, JPEG
- **Max Size:** 10MB per file
- **Pre-signed URLs:** 1-hour expiry for downloads

## Link Tables

### OpportunityDocumentLink

Links Documents to Opportunities with requirement metadata.

| Column | Type | Notes |
|---|---|---|
| opportunity_id | FK | Required |
| document_id | FK | Required |
| requirement_type | text | "required", "optional", "recommended" |
| notes | text | Free-form |

### ApplicationDocumentLink

Links Documents to Applications with **version pinning**.

| Column | Type | Notes |
|---|---|---|
| application_id | FK | Required |
| document_id | FK | Required |
| document_version_id | text | **Pins specific version** |
| attached_at | timestamp | When linked |

**Key Behavior:** When a Document is updated (new version), the ApplicationDocumentLink preserves the pinned version. This ensures submitted applications reference the exact document version that was submitted.

## Domain Events

DocumentUploaded, DocumentVersionCreated, DocumentApproved, DocumentLinked, DocumentExpired, DocumentArchived

## Canonical Source

`docs/03-domain/entities.md` (§21.5), `docs/05-engineering/database.md`
