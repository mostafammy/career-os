# Security Architecture

**File:** `docs/05-engineering/security.md`

---

# Security Architecture

**Status:** Canonical
**Version:** 1.0

---

## 1. Purpose

This document defines the security architecture for CareerOS. It covers authentication, authorization, encryption, data protection, audit logging, and incident response.

CareerOS stores highly valuable personal and professional information — CVs, transcripts, career strategies, reflections, and application essays. Security is a foundational architectural concern, not an optional feature.

**Canonical references:**

- Security Principles: `docs/01-product/PRD.md` (§24 — Security, Privacy & Data Governance)
- Data Classification: `docs/01-product/PRD.md` (§24.4)
- Product Principles: P-010 (Trust is the Foundation)

---

## 2. Security Principles

| ID | Principle | Implementation |
|---|---|---|
| SEC-001 | **Security by Design** | Threat modeling during design, not bolted on after |
| SEC-002 | **Privacy by Default** | Minimal data collection, opt-in for everything non-essential |
| SEC-003 | **User Data Ownership** | Users own all their data. CareerOS is a steward, not an owner |
| SEC-004 | **Least Privilege** | Every component accesses only what it needs |
| SEC-005 | **Auditability** | Every sensitive action generates an immutable audit record |
| SEC-006 | **Fail Securely** | Errors never expose sensitive data or bypass security controls |
| SEC-007 | **Trust Over Convenience** | Security always wins when trade-offs exist |

---

## 3. Authentication

### 3.1 Authentication Provider

NextAuth.js v5 handles all authentication flows.

### 3.2 Supported Methods

| Method | Phase | Justification |
|---|---|---|
| **Google OAuth** | 1 (MVP) | Most common OAuth provider, low friction |
| **GitHub OAuth** | 1 (MVP) | Developer-friendly, aligns with persona |
| **Email Magic Link** | 1 (MVP) | No password management, phishing-resistant |
| **Microsoft OAuth** | 2 | Enterprise and university accounts |
| **Apple Sign-In** | 2 | Privacy-focused users |
| **University SSO (SAML)** | 4 | Enterprise/institutional users |

### 3.3 Session Management

| Property | Value |
|---|---|
| Session Type | Database-backed (not JWT for Phase 1) |
| Session Lifetime | 30 days |
| Idle Timeout | 7 days |
| Absolute Timeout | 30 days |
| Renewal | Sliding window — extends on activity |

**Session Storage:**

```
sessions table in D1:
  id: UUIDv7
  session_token: hashed token
  user_id: FK to users
  expires: ISO 8601 datetime
```

**Session Token Security:**

- Tokens are generated using `crypto.randomBytes(32)` (256 bits of entropy)
- Tokens are hashed (SHA-256) before storage
- Raw token is only sent to the client via secure cookie
- Tokens are invalidated on logout, password change, and account deletion

### 3.4 Multi-Factor Authentication

| Phase | Capability |
|---|---|
| Phase 1 | Not implemented (single-user alpha) |
| Phase 2 | TOTP-based MFA (Google Authenticator, Authy) |
| Phase 3 | WebAuthn / Passkeys |
| Phase 4 | Enterprise SSO with MFA enforced |

### 3.5 OAuth Security

- **PKCE** (Proof Key for Code Exchange) for all OAuth flows
- **State parameter** validated on callback to prevent CSRF
- **Nonce** included in OpenID Connect flows
- **Token refresh** handled server-side, never exposed to client
- **Scope minimization** — request only necessary permissions

---

## 4. Authorization

### 4.1 Data Scoping

Every database query is scoped to the authenticated user:

```sql
-- Every query includes:
WHERE user_id = ? AND deleted_at IS NULL
```

This is enforced at the **repository layer**, not the application layer. There is no way to accidentally query another user's data.

### 4.2 Role-Based Access Control (RBAC)

| Phase | Roles | Justification |
|---|---|---|
| Phase 1 | Owner only | Single-user alpha |
| Phase 3 | Owner, Collaborator | Shared workspaces |
| Phase 4 | Owner, Collaborator, Mentor, Reviewer, Admin | Enterprise features |

### 4.3 Permission Matrix (Phase 1)

| Resource | Owner |
|---|---|
| Opportunities | Full CRUD |
| Applications | Full CRUD |
| Documents | Full CRUD, download |
| Goals | Full CRUD |
| Knowledge | Full CRUD |
| Settings | Full access |
| Export | Full access |
| Import | Full access |

### 4.4 Authorization Checks

Authorization is checked at three levels:

1. **Middleware** — Authentication check on every request (NextAuth.js)
2. **Application Layer** — Business rule validation (e.g., can this user action this opportunity?)
3. **Repository Layer** — Data scoping (WHERE user_id = ?)

---

## 5. Encryption

### 5.1 In Transit

| Layer | Protocol | Implementation |
|---|---|---|
| Client ↔ Edge | TLS 1.3 | Cloudflare SSL/TLS (automatic) |
| Edge ↔ Origin | TLS 1.2+ | Cloudflare Workers internal |
| API ↔ Database | TLS 1.2+ | D1 connection encryption |

### 5.2 At Rest

| Data Type | Storage | Encryption |
|---|---|---|
| Database (D1) | Cloudflare-managed | AES-256 (Cloudflare default) |
| File storage (R2) | Cloudflare-managed | AES-256 (server-side encryption) |
| Environment secrets | Cloudflare dashboard | Encrypted at rest |

### 5.3 Application-Level Encryption

| Field | Encryption | Purpose |
|---|---|---|
| Integration access tokens | AES-256-GCM | Protect OAuth tokens from database compromise |
| Integration refresh tokens | AES-256-GCM | Protect refresh tokens |
| Session tokens | SHA-256 hash | Never store raw tokens |

**Encryption Key Management:**

- Keys stored as environment variables (never in code)
- Keys rotated quarterly
- Key rotation is a zero-downtime operation (dual-encrypt during rotation)

---

## 6. Data Protection

### 6.1 Data Classification

Ref: `docs/01-product/PRD.md` (§24.4)

| Classification | Examples | Protection |
|---|---|---|
| **Public** | Organization names, scholarship descriptions | Standard access control |
| **Internal** | Tags, checklists, task metadata | Authenticated access only |
| **Confidential** | CVs, transcripts, essays, reflections, career goals | Authenticated + encrypted at rest |
| **Restricted** | Auth credentials, API tokens, encryption keys | Never exposed, encrypted, rotated |

### 6.2 Input Validation

All user input is validated at the application layer before processing:

| Validation | Implementation |
|---|---|
| Type checking | TypeScript strict mode + Zod schemas |
| Length limits | Max field lengths enforced (e.g., title: 500 chars) |
| Format validation | Email, URL, date formats validated |
| SQL injection | Drizzle ORM parameterized queries (never raw SQL with user input) |
| XSS | React auto-escaping + Content Security Policy |
| File upload | MIME type validation, file size limits, virus scanning (Phase 3) |

### 6.3 File Upload Security

| Control | Implementation |
|---|---|
| File size limit | 10 MB per file |
| Allowed MIME types | PDF, DOCX, DOC, TXT, PNG, JPG, JPEG |
| File naming | Server-generated names (never use user-provided filename for storage) |
| Storage path | `documents/{user_id}/{doc_id}/v{version}/{server_generated_name}` |
| Access control | Pre-signed URLs with 1-hour expiry for downloads |

### 6.4 Output Encoding

- React escapes all output by default
- No `dangerouslySetInnerHTML` unless absolutely necessary (with sanitization)
- Content Security Policy headers prevent inline script execution

---

## 7. Audit Trail

### 7.1 Audit Events

Every sensitive operation generates an immutable `Activity` record (ref: `database.md` §9.1).

**Events to audit:**

| Category | Events |
|---|---|
| Authentication | Login, logout, MFA setup, MFA change, password change |
| Data mutations | Create, update, delete for all entities |
| File operations | Upload, download, delete |
| Integrations | Connect, disconnect, sync |
| Export | Data export generated |
| Admin | Settings change, role change (future) |

### 7.2 Audit Record Structure

```json
{
  "id": "01JAF4YZPQ3T0Q2M7G5BXQ1D8R",
  "user_id": "user-123",
  "entity_type": "opportunity",
  "entity_id": "opp-456",
  "action": "archived",
  "actor": "user:user-123",
  "metadata": {
    "reason": "deadline_passed",
    "ip_address": "192.168.1.1",
    "user_agent": "Mozilla/5.0..."
  },
  "occurred_at": "2028-03-12T14:30:00Z"
}
```

### 7.3 Audit Immutability

- Activities table has no UPDATE or DELETE permissions
- Audit records are append-only (INV-004, INV-010)
- Audit records cannot be modified even by the user who created them
- Admin-level audit review (future Phase 4)

---

## 8. API Security

### 8.1 Rate Limiting

| Endpoint Category | Rate Limit | Window |
|---|---|---|
| General API | 1000 requests | Per hour |
| Authentication | 10 requests | Per 15 minutes |
| File upload | 100 requests | Per hour |
| AI endpoints | 50 requests | Per hour |
| Search | 200 requests | Per hour |

### 8.2 CORS Policy

```
Access-Control-Allow-Origin: https://career-os.mostafayaser.earth
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, Idempotency-Key
Access-Control-Max-Age: 86400
```

### 8.3 Content Security Policy

```
default-src 'self';
script-src 'self' 'nonce-{random}';
style-src 'self' 'unsafe-inline';
img-src 'self' https://avatars.githubusercontent.com data:;
connect-src 'self' https://api.career-os.mostafayaser.earth;
font-src 'self';
object-src 'none';
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

### 8.4 Security Headers

| Header | Value | Purpose |
|---|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Force HTTPS |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limit referrer leakage |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disable unused APIs |

### 8.5 Idempotency

All mutation endpoints support idempotency via the `Idempotency-Key` header to prevent duplicate operations on retries (ref: `api-design.md` §7).

---

## 9. Infrastructure Security

### 9.1 Cloudflare Security

| Feature | Implementation |
|---|---|
| DDoS Protection | Cloudflare automatic DDoS mitigation |
| WAF | Cloudflare WAF rules for common attack patterns |
| Bot Management | Cloudflare Bot Fight Mode |
| SSL/TLS | Automatic SSL certificate management |
| Origin Rules | Hide origin server IP |

### 9.2 Environment Variables

- All secrets stored in Cloudflare dashboard (never in code)
- `.env.local` is gitignored
- Environment variables are not logged or exposed in error messages
- API keys are rotated quarterly

### 9.3 Dependency Security

- `pnpm audit` runs in CI on every PR
- Dependabot or Renovate for automated dependency updates
- Critical vulnerabilities patched within 24 hours
- High vulnerabilities patched within 7 days

---

## 10. Incident Response

### 10.1 Incident Classification

| Severity | Description | Response Time |
|---|---|---|
| **Critical** | Data breach, unauthorized access, data loss | Immediate |
| **High** | Authentication bypass, privilege escalation | Within 4 hours |
| **Medium** | Service degradation, non-critical vulnerability | Within 24 hours |
| **Low** | Minor issues, informational findings | Within 7 days |

### 10.2 Response Procedure

1. **Detect** — Automated monitoring alerts
2. **Assess** — Determine severity and impact
3. **Contain** — Isolate affected systems
4. **Eradicate** — Remove root cause
5. **Recover** — Restore service
6. **Communicate** — Notify affected users (if applicable)
7. **Review** — Post-incident analysis, update procedures

### 10.3 Monitoring & Alerting

| Signal | Tool | Alert Threshold |
|---|---|---|
| Authentication failures | Sentry | > 5 failures in 5 minutes |
| API errors (5xx) | Sentry | > 1% error rate |
| Database errors | Cloudflare dashboard | Any connection failure |
| Unusual traffic patterns | Cloudflare analytics | Anomalous spike detected |
| Dependency vulnerabilities | pnpm audit / Dependabot | Critical or high severity |

---

## 11. Privacy

### 11.1 Data Collection

| Data Collected | Purpose | Required |
|---|---|---|
| Email | Authentication | Yes |
| Name | Display | Optional |
| Avatar | Display | Optional (from OAuth provider) |
| Usage analytics | Product improvement | Opt-in only |

### 11.2 Data Retention

| Data Type | Retention | Deletion |
|---|---|---|
| User account | Until user deletes | Cascade delete all data |
| Opportunities | Until user deletes | Soft delete, then hard delete after 30 days |
| Documents | Until user deletes | R2 object deleted with document |
| Audit logs | 1 year | Automatic purge after retention period |
| Sessions | 30 days | Automatic expiry |

### 11.3 Data Export

Users can export their complete workspace at any time:

- JSON format (structured, machine-readable)
- CSV format (tabular data)
- PDF reports (human-readable)

Export includes all entities, documents, reflections, knowledge entries, and activity logs.

Ref: `docs/05-engineering/api-design.md` (§5.12 — Import/Export Endpoints)

### 11.4 Account Deletion

When a user requests account deletion:

1. All personal data is permanently deleted within 30 days
2. Documents in R2 are permanently deleted
3. Audit logs are retained for 1 year (legal compliance) then purged
4. The account is marked as deleted immediately
5. Session tokens are invalidated immediately
6. OAuth connections are revoked

---

## 12. Security Checklist

### Pre-Deployment

- [ ] All secrets in environment variables (not in code)
- [ ] `.env.local` is gitignored
- [ ] No `console.log` with sensitive data
- [ ] CSRF protection enabled
- [ ] XSS prevention verified
- [ ] SQL injection prevention verified (parameterized queries)
- [ ] Rate limiting configured
- [ ] Security headers configured
- [ ] CORS policy configured
- [ ] Content Security Policy configured
- [ ] File upload validation implemented
- [ ] Input validation on all endpoints
- [ ] Authentication on all protected endpoints
- [ ] Data scoping (WHERE user_id = ?) on all queries

### Ongoing

- [ ] `pnpm audit` passes in CI
- [ ] Dependencies updated regularly
- [ ] Security headers reviewed quarterly
- [ ] Access logs reviewed monthly
- [ ] Encryption keys rotated quarterly
- [ ] Incident response plan tested annually

---

## 13. Open Items

1. **Penetration Testing** — Schedule professional penetration test before public launch.
2. **SOC 2 Compliance** — Evaluate if SOC 2 is required for enterprise features (Phase 5).
3. **GDPR Compliance** — Implement data subject access requests when expanding to EU users.
4. **Bug Bounty Program** — Consider implementing before public launch.

---

## Version History

| Version | Date | Description |
|---|---|---|
| 1.0 | Initial Draft | Established canonical security architecture for CareerOS. |
