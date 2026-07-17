# CareerOS Entity Relationship Diagram (ERD)

**File:** `docs/03-domain/erd.md`

---

# Entity Relationship Diagram

**Status:** Canonical
**Version:** 1.0

---

## Purpose
This document provides a visual representation of the domain entities and their relationships as defined in `entities.md`. It uses Mermaid syntax to generate the diagram, illustrating the structural cardinality and relationships between Aggregates.

*Note: This is a semantic domain model ERD, not a strict database schema diagram. It describes conceptual relationships, not foreign keys or join tables.*

---

## The CareerOS Domain Model

```mermaid
erDiagram
    %% Core Identity
    USER {
        string id PK
        string email
    }

    %% Strategy Context (Vision, Goals)
    VISION {
        string id PK
        string statement
    }
    MISSION {
        string id PK
        string title
    }
    GOAL {
        string id PK
        string objective
        string status
    }
    MILESTONE {
        string id PK
        string title
        boolean completed
    }

    %% Opportunity Context (Inbox, Apps)
    ORGANIZATION {
        string id PK
        string name
        string industry
    }
    OPPORTUNITY {
        string id PK
        string title
        string status
        date deadline
    }
    APPLICATION {
        string id PK
        string status
        date submitted_date
    }
    ACTIVITY {
        string id PK
        string type
        date occurred_at
    }

    %% Knowledge Context (Reflections, AI)
    DOCUMENT {
        string id PK
        string title
        string type
    }
    REFLECTION {
        string id PK
        text content
    }
    KNOWLEDGE_ENTRY {
        string id PK
        string category
        text insight
    }

    %% Relationships based on Cardinality Matrix
    USER ||--|| VISION : "owns"
    VISION ||--o{ MISSION : "contains"
    MISSION ||--o{ GOAL : "contains"
    GOAL ||--o{ MILESTONE : "contains"
    
    %% N:N relationship between Goal and Opportunity
    GOAL }o--o{ OPPORTUNITY : "influences"
    
    ORGANIZATION ||--o{ OPPORTUNITY : "publishes"
    OPPORTUNITY ||--o{ APPLICATION : "produces"
    
    %% N:N relationship between Opportunity/Application and Document
    OPPORTUNITY }o--o{ DOCUMENT : "requires"
    APPLICATION }o--o{ DOCUMENT : "references"
    
    OPPORTUNITY ||--o{ ACTIVITY : "generates"
    APPLICATION ||--o| REFLECTION : "generates (0..1)"
    
    REFLECTION ||--o{ KNOWLEDGE_ENTRY : "creates"
    
    %% N:N relationship between Knowledge and Goal
    KNOWLEDGE_ENTRY }o--o{ GOAL : "supports"
```

---

## Aggregate Boundaries

When implementing this ERD, remember the boundaries defined by the **Domain Context Map**:

1. **Strategy Context** (`VISION`, `MISSION`, `GOAL`, `MILESTONE`): Owns the long-term career trajectory.
2. **Opportunity Context** (`ORGANIZATION`, `OPPORTUNITY`, `APPLICATION`, `ACTIVITY`): Owns the execution pipeline of specific roles or grants.
3. **Knowledge Context** (`DOCUMENT`, `REFLECTION`, `KNOWLEDGE_ENTRY`): Owns the compounding career capital and reusable assets.

Relationships that cross these context boundaries (e.g., `GOAL` influencing `OPPORTUNITY`, or `KNOWLEDGE_ENTRY` supporting `GOAL`) are typically implemented as loose references (IDs) rather than strong database foreign keys, allowing the contexts to evolve independently.
