---
id: APPLICATION-006
title: "Security Architecture"
status: canonical
version: "1.0"
owner: "Security Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: high
change_frequency: low
consumers:
  - Backend Agent
  - DevOps Agent
  - Review Agent
  - Security Agent
  - AI Agent
depends_on:
  - CORE-003
  - CORE-005
tags:
  - application
  - security
  - always-load
always_loaded: true
---

# APPLICATION-006 — Security Architecture

## Security Principles

| ID | Principle |
|---|---|
| SEC-001 | **Security by Design** — Threat modeling during design, not bolted on after |
| SEC-002 | **Privacy by Default** — Minimal data collection, opt-in for everything non-essential |
| SEC-003 | **User Data Ownership** — Users own all their data. CareerOS is a steward, not an owner |
| SEC-004 | **Least Privilege** — Every component accesses only what it needs |
| SEC-005 | **Auditability** — Every sensitive action generates an immutable audit record |
| SEC-006 | **Fail Securely** — Errors never expose sensitive data or bypass security controls |
| SEC-007 | **Trust Over Convenience** — Security always wins when trade-offs exist |

## Authentication

| Phase | Methods |
|---|---|
| Phase 1 | Google OAuth, GitHub OAuth, Email Magic Link |
| Phase 2 | + Microsoft OAuth, Apple Sign-In, TOTP MFA |
| Phase 3 | + WebAuthn / Passkeys |
| Phase 4 | + University SSO (SAML) |

**Session Management:**
- Database-backed (not JWT for Phase 1)
- Lifetime: 30 days, Idle: 7 days, Sliding window renewal
- Tokens: `crypto.randomBytes(32)`, SHA-256 hashed before storage
- PKCE for all OAuth flows, state parameter validated on callback

## Authorization

Every query includes: `WHERE user_id = ? AND deleted_at IS NULL`
Enforced at **repository layer**, not application layer.

Phase 1: Owner only (single-user alpha). RBAC deferred to Phase 5.

## Encryption

| Layer | Protocol |
|---|---|
| In Transit | TLS 1.3 (client↔edge), TLS 1.2+ (edge↔origin, API↔DB) |
| At Rest | AES-256 (database, file storage, managed by provider) |
| Application-Level | AES-256-GCM for integration tokens, SHA-256 for session tokens |

## Data Classification

| Level | Examples | Protection |
|---|---|---|
| Public | Organization names, scholarship descriptions | Standard access control |
| Internal | Tags, checklists, task metadata | Authenticated access only |
| Confidential | CVs, transcripts, essays, reflections, career goals | Authenticated + encrypted at rest |
| Restricted | Auth credentials, API tokens, encryption keys | Never exposed, encrypted, rotated |

## File Upload Security

- Max 10MB per file
- Allowed MIME: PDF, DOCX, DOC, TXT, PNG, JPG, JPEG
- Server-generated filenames (never user-provided)
- Storage path: `documents/{user_id}/{doc_id}/v{version}/{server_generated_name}`
- Pre-signed URLs with 1-hour expiry

## Rate Limits

| Category | Limit | Window |
|---|---|---|
| General API | 1000 requests | Per hour |
| Authentication | 10 requests | Per 15 minutes |
| File upload | 100 requests | Per hour |
| AI endpoints | 50 requests | Per hour |
| Search | 200 requests | Per hour |

## Security Headers

- HSTS: `max-age=63072000; includeSubDomains; preload`
- X-Content-Type-Options: `nosniff`
- X-Frame-Options: `DENY`
- Referrer-Policy: `strict-origin-when-cross-origin`
- Permissions-Policy: camera, microphone, geolocation disabled

## AI Security Rules

- NEVER load APPLICATION-001 (Intelligence) without this module (APPLICATION-006)
- AI processes confidential career data — privacy rules must be co-present
- AI ethical constraints: NEVER fabricate skills/experiences, ALWAYS flag AI-generated content
- User approval required for all AI-generated knowledge commits

## Canonical Source

`docs/05-engineering/security.md`
