# Domain Workflows

**File:** `docs/03-domain/workflows.md`

---

# Domain Workflows

**Status:** Canonical
**Version:** 1.0

---

## Purpose
While the ERD defines static structural relationships and State Machines define internal entity lifecycles, **Workflows** define how entities interact across time. This document maps out the specific multi-aggregate sequences that drive CareerOS.

---

## 1. The Core Loop (End-to-End Journey)

This is the high-level representation of the CareerOS philosophy: turning an isolated opportunity into compounding career capital.

```mermaid
sequenceDiagram
    actor User
    participant Strategy as Strategy Context
    participant Inbox as Opportunity Context
    participant Knowledge as Knowledge Context
    
    User->>Inbox: 1. Capture Opportunity
    Inbox->>Strategy: 2. Request active Goals
    Strategy-->>Inbox: 3. Return active Goals/Metrics
    
    User->>Inbox: 4. Evaluate against Goals
    
    alt Is Strategic Fit
        User->>Inbox: 5a. Action Opportunity -> Creates Application
        Inbox->>Knowledge: 6. Search for reusable Assets
        Knowledge-->>Inbox: 7. Attach matching Documents
        User->>Inbox: 8. Submit Application & Track Timeline
    else Not Strategic Fit
        User->>Inbox: 5b. Archive Opportunity
    end
    
    Note over Inbox, Knowledge: Time Passes (Interviews, Decisions)
    
    Inbox->>User: 9. Prompt for Reflection on Terminal State
    User->>Knowledge: 10. Complete Reflection
    Knowledge->>Strategy: 11. Extract Insights / Update Career Capital
```

---

## 2. Capture & Enrichment Workflow

Focuses on what happens the moment a user discovers a new opportunity on the web. It emphasizes automation and reducing the user's cognitive load (Product Principle P-002: Capture First, Organize Later).

```mermaid
flowchart TD
    A[Browser Extension / Inbox] -->|Submit URL/Text| B(Opportunity Created)
    B --> C{AI Extraction}
    C -->|Extracts| D[Organization Name]
    C -->|Extracts| E[Deadline]
    C -->|Extracts| F[Required Documents]
    
    D --> G{Organization Exists?}
    G -->|Yes| H[Link to Existing Org]
    G -->|No| I[Create New Org Entity]
    
    E --> J[Add to Opportunity Timeline]
    F --> K[Generate Task List]
    
    H --> L[Opportunity state: CAPTURED]
    I --> L
    J --> L
    K --> L
```

---

## 3. The Interview & Reflection Workflow

Focuses on the transformation of an experience into reusable knowledge (Product Principle P-006: Knowledge Compounds).

```mermaid
sequenceDiagram
    actor User
    participant App as Application (Opportunity Context)
    participant Ref as Reflection (Knowledge Context)
    participant Cap as Career Capital (Strategy Context)
    
    User->>App: Update status to INTERVIEWING
    App->>App: Generate Interview Activity
    User->>App: Log interview date/time
    
    Note over User, App: Interview occurs
    
    App->>User: Auto-prompt: "How did the interview go?"
    User->>Ref: Create Reflection Entry
    Ref->>Ref: Log questions asked
    Ref->>Ref: Log perceived skill gaps
    
    Ref->>Cap: Append new Interview Questions to global list
    Ref->>Cap: Update User's known "Areas for Improvement"
    
    User->>App: Update status to REJECTED or OFFER_RECEIVED
```

---

## Domain Enforcement Rules

For engineering implementation, these workflows dictate specific architectural constraints:
1. **Context Isolation**: The Opportunity Context cannot directly modify Career Capital. It must emit an event (e.g., `ReflectionCompleted`) that the Strategy Context listens to.
2. **Asynchronous Enrichment**: AI Extraction during the Capture Workflow must be asynchronous. The user should instantly see the `CAPTURED` Opportunity while extraction runs in the background.
3. **Mandatory Triggers**: The system *must* automatically transition to the Reflection phase upon an Application reaching a terminal state. Relying on the user to manually navigate to a "Reflection" screen violates the core loop.
