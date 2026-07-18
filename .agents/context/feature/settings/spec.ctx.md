---
id: FEATURE-014
title: "Settings"
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
depends_on:
  - APPLICATION-006
tags:
  - feature
  - settings
  - phase-1
---

# FEATURE-014 — Settings

## Purpose

Configure preferences, integrations, and personalization for the CareerOS experience.

## User Value

- Control notification behavior and automation preferences
- Manage account and security settings
- Configure AI behavior and privacy settings

## Core Capabilities

| Capability | Description |
|---|---|
| **Profile** | User name, email, avatar |
| **Notification Preferences** | Toggle notification types, timing, channels |
| **Automation Preferences** | Enable/disable specific automations |
| **AI Preferences** | Control AI behavior, data usage, explanation verbosity |
| **Integrations** | Connect external services (Google Calendar, email) |
| **Security** | Password, MFA, session management |
| **Data Management** | Export data, delete account |
| **Appearance** | Theme (light/dark), compact mode |

## Settings Sections

| Section | Key Settings |
|---|---|
| **Profile** | Name, email, avatar, timezone |
| **Notifications** | Deadline alerts, follow-up reminders, email notifications |
| **Automation** | Auto-archive stale opportunities, auto-create Applications |
| **AI** | AI extraction enabled, fit scoring, document generation |
| **Integrations** | Google Calendar sync, email forwarding, browser extension |
| **Security** | Change password, enable MFA, active sessions |
| **Data** | Export all data, delete account |
| **Appearance** | Theme, language, compact mode |

## Business Rules

- SET-001: Users can toggle any automation on/off
- SET-002: AI data usage settings affect all AI features
- SET-003: Data export includes all user data in JSON format
- SET-004: Account deletion is irreversible and requires confirmation
- SET-005: Session management shows all active sessions with revoke option

## Dependencies

- APPLICATION-006 (Security) — Session management, MFA, data encryption

## Acceptance Criteria

- [ ] Profile settings save correctly
- [ ] Notification preferences toggle specific notification types
- [ ] Automation preferences enable/disable specific rules
- [ ] AI preferences control extraction and scoring behavior
- [ ] Data export produces complete JSON archive
- [ ] Account deletion requires double confirmation
