# AI & Machine Learning Features

**File:** `docs/04-automation/ai-features.md`

---

# AI Capabilities & Specifications

**Status:** Canonical
**Version:** 1.0

---

## AI Philosophy

As stated in our Product Principles (**P-004** and **P-016**):
- **AI must augment human judgment, never override it.** The user owns their career decisions.
- **Explain Before You Automate.** AI outputs must be explainable. If the AI suggests an action, it must briefly state *why*.

AI in CareerOS is not about writing generic applications; it is about reducing cognitive load, organizing chaos, and synthesizing the user's own compounded knowledge.

---

## 1. Intelligent Capture (Data Extraction)

**Domain Context:** Opportunity Context
**Trigger:** User captures a URL, raw text, or email via the Inbox.

**Functionality:**
Instead of manual data entry, the AI parses the unstructured data to populate the `Opportunity` entity.
- **Extracts:** Organization Name, Role Title, Application Deadline, Location, Salary Range.
- **Identifies:** Required documents (e.g., "Resume, Cover Letter, 3 References").
- **Action:** Generates a structured Opportunity draft. The user always reviews and clicks "Save" before it enters the pipeline.

**Explainability:** The UI highlights which text in the original document maps to the extracted fields.

---

## 2. Strategic Fit Scoring

**Domain Context:** Strategy Context & Opportunity Context
**Trigger:** An Opportunity is moved to the `EVALUATING` state.

**Functionality:**
The AI compares the semantic requirements of the Opportunity against the user's active `Goals` and current `Career Capital`.
- **Output:** A "Fit Score" (e.g., High, Medium, Low Fit).
- **Reasoning:** Generates bullet points explaining the score (e.g., "✅ Aligns with your goal to move into FinTech. ⚠️ Requires 5 years of Python; your Career Capital indicates 3 years.").

**Explainability:** The AI explicitly links its score to the user's defined Goals.

---

## 3. Asset Suggestion Engine (Knowledge Retrieval)

**Domain Context:** Knowledge Context
**Trigger:** User moves an Opportunity to `ACTIONED` and begins `DRAFTING`.

**Functionality:**
CareerOS acts as a retrieval-augmented generation (RAG) system over the user's own historical data.
- The AI analyzes the job description.
- It searches the user's `Knowledge Entries` and past `Documents`.
- **Output:** Surfaces the 3 most relevant past cover letters, portfolio pieces, or essay answers that best match the current opportunity's requirements.

**Explainability:** "Suggested because this opportunity emphasizes 'Cross-functional leadership', similar to your Application to Stripe in 2024."

---

## 4. Tailored Document Generation

**Domain Context:** Opportunity Context
**Trigger:** User requests a draft for a Cover Letter or tailored Resume.

**Functionality:**
The AI takes the user's `Career Capital` (Master Resume, past reflections, portfolio) and the `Opportunity` description to generate a *first draft*.
- **Constraint:** The AI is strictly instructed to *only* use facts present in the user's Career Capital. It is barred from hallucinating skills or experiences.

**Explainability:** The AI flags sentences it generated so the user is forced to review and edit them in their own voice.

---

## 5. Reflection Synthesis (Knowledge Compounding)

**Domain Context:** Knowledge Context & Strategy Context
**Trigger:** User completes an unstructured `Reflection` after an interview or rejection.

**Functionality:**
Users often brain-dump notes after an interview (e.g., "They asked about my time at Acme Corp, I totally bombed the database scaling question").
- The AI parses these unstructured notes.
- **Output:** Proposes structured updates to `Career Capital`.
  - *New Interview Question added to bank:* "How did you scale the database at Acme Corp?"
  - *New Skill Gap identified:* "Database Scaling architecture."
  - *Decision Journal Entry:* "Struggled with technical deep-dive; need to review system design."

**Explainability:** The user must explicitly approve these extracted insights before they are committed to the Knowledge database.
