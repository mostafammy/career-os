import fs from "fs";
import path from "path";

const root = process.cwd();
const featureDir = path.join(root, ".agents/context/feature");
const outDir = path.join(root, "docs/01-product/features");

function front(raw, key) {
  const re = new RegExp(`^${key}:\\s*(.+)$`, "m");
  const m = raw.match(re);
  return m ? m[1].trim().replace(/^"|"$/g, "") : "";
}

const dirs = fs
  .readdirSync(featureDir, { withFileTypes: true })
  .filter((d) => d.isDirectory());

let count = 0;
for (const d of dirs) {
  const specPath = path.join(featureDir, d.name, "spec.ctx.md");
  if (!fs.existsSync(specPath)) continue;
  const raw = fs.readFileSync(specPath, "utf8");
  const body = raw.replace(/^---[\s\S]*?---\s*/, "");
  const id = front(raw, "id");
  const title = front(raw, "title") || d.name;
  const phase = front(raw, "phase") || "1";
  const slug = d.name;

  const doc = `# ${title}

## Metadata
- **Feature ID:** ${id}
- **Slug:** ${slug}
- **Status:** Approved (agent context SSOT mirrored)
- **Owner:** Product Agent
- **Last Updated:** 2026-07-18
- **Target Release:** Phase ${phase}
- **Agent Context SSOT:** \`.agents/context/feature/${slug}/spec.ctx.md\`
- **Catalog Entry:** \`docs/01-product/feature-index.md\`

## Purpose
See the specification body. This human-facing document is mirrored from the operational feature context module so product docs and agent context stay aligned.

## Problem Statement
Users need a dedicated capability for **${title}** inside the CareerOS core loop (Capture → Understand → Decide → Prepare → Execute → Reflect → Learn → Improve) without fragmenting career work across unrelated tools.

## Success Definition
- Acceptance criteria in the specification body are met
- Phase gate respected (ROADMAP-001): Phase ${phase} scope only when implementing
- Canonical terminology (CORE-002) used in UI and API
- User-scoped data only (single-user alpha)

## Personas
See \`docs/01-product/user-personas.md\` and \`.agents/context/product/personas/personas.ctx.md\`. Primary: ambitious career decision-maker managing opportunities and applications.

## User Stories
- As an ambitious professional, I want **${title}** capabilities so that I can make better career decisions with less cognitive load.
- As a user, I want this feature to respect progressive disclosure and the Universal Workspace pattern so that I learn one interface, not many.

## Jobs To Be Done
When I am advancing my career workflow, I want **${title}** support so I can capture, decide, execute, or learn without leaving CareerOS.

## Functional Scope
All capabilities, business rules, dependencies, and acceptance criteria listed in the specification body below.

## Out of Scope
- Features deferred by ROADMAP-001 for later phases than Phase ${phase}
- Multi-user / RBAC (Phase 5+)
- Any behavior that violates product anti-patterns (task manager, CRM, social network)

## Core Concepts
Uses ubiquitous language from CORE-002 / \`docs/00-overview/glossary.md\`. Domain rules live in parent DOMAIN-* modules referenced under Dependencies.

## Information Architecture
Fits primary navigation and workspace patterns in UI-001 / \`.agents/context/ui/ia/information-architecture.ctx.md\`.

## User Journey
See capability flows and workspace tabs in the specification body. Cross-navigation follows: Opportunity → Organization → Applications → Documents → Goals → Analytics → Knowledge.

## Specification Body (from agent context)

${body.trim()}

## Permissions
Single-user alpha: all data scoped to the authenticated user. No cross-user access. Repository queries must enforce user scoping.

## Searchability
If the entity is listed in FEATURE-011 Search scope, it is indexed for global search. Soft-deleted rows excluded; archived flagged.

## Notifications
Lifecycle and deadline events may emit in-app notifications per FEATURE-013 and APPLICATION-002 automations (phase-dependent).

## Automation
Deterministic automations only via APPLICATION-002. AI behaviors (if any) via APPLICATION-001 with user approval gates.

## AI Behaviors
Only where explicitly specified in the body and allowed by phase. Always explainable, flagged, and user-reviewed (P-004, P-016).

## Analytics
Entity state changes and Activities feed operational analytics (FEATURE-010 / APPLICATION-003) when in phase.

## Edge Cases
- Empty states must offer next best action
- Phase-deferred AI or integrations must not appear as fully available
- Archive/revive and soft-delete paths preserve searchability rules

## Error States
- Validation errors surface field-level messages
- Network/API failures: recoverable toast + retry
- Authorization: fail-closed (no other users' data)

## Performance
- Interactive views target < 500ms perceived load for primary panels
- Search instant results < 300ms (FEATURE-011)
- Prefer progressive loading over blocking spinners for secondary tabs

## Accessibility
WCAG AA baseline; keyboard paths for primary actions; status not by color alone (UI-002).

## Security
APPLICATION-006 always applies. No secrets in client. File uploads validated when documents involved.

## Dependencies
See Dependencies section in specification body. Also: CORE-001, CORE-002, ROADMAP-001.

## Future Evolution
Later phases may deepen AI, multi-user, and integrations per ROADMAP-001 without breaking core domain invariants.

## Open Questions
- Visual token finalization tracked in design system doc
- Exact notification channel matrix for Phase 2+

## Decision Log
- 2026-07-18: Human product feature doc populated from agent context SSOT to close documentation gap.
`;

  fs.writeFileSync(path.join(outDir, `${slug}.md`), doc, "utf8");
  count += 1;
  console.log("Wrote", `${slug}.md`);
}
console.log("Total features:", count);
