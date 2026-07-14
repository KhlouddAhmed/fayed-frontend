<div align="center">
<img src="public/assets/logo/blue-logo.svg" alt="FAYED Logo" width="220" />

  # فايض | FAYED
 
### B2B Marketplace for Industrial Surplus & Production By-Products
### سوق إلكتروني لفائض المواد الخام وهدر الإنتاج بين المصانع
 
![Angular](https://img.shields.io/badge/Angular-22-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5_RTL-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![.NET](https://img.shields.io/badge/.NET-9-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![SignalR](https://img.shields.io/badge/SignalR-Realtime-0078D4?style=for-the-badge&logo=microsoftsignalr&logoColor=white)
![NgRx](https://img.shields.io/badge/NgRx-SignalStore-BA2BD2?style=for-the-badge&logo=reactivex&logoColor=white)
 
</div>
 
## 📖 Table of Contents
 
- [Overview](#overview)
- [Key Features](#key-features)
- [AI Trinity](#ai-trinity)
- [Tech Stack](#tech-stack)
- [Architecture Highlights](#architecture-highlights)
- [Project Structure](#project-structure)
- [Sprint Plan](#sprint-plan)
- [Getting Started](#getting-started)
- [Further Reading](#further-reading)
---
 
## Overview
 
**FAYED** is a specialized **B2B online marketplace** in Egypt that connects verified industrial companies to buy and sell surplus raw materials and production by-products — turning industrial waste into a source of income and promoting a **circular economy**.
 
The platform provides a fully supervised environment for negotiation, contract agreement, escrow-secured payments, and dispute resolution — ensuring trust and safety for every transaction.
 
 
---
 
## Key Features
 
### 🔐 Company Registration & KYB Verification
| Feature | Description |
|---|---|
| **3-Step Onboarding** | Multi-step registration with company info, document upload, and OTP verification |
| **Document Upload** | Commercial registry, tax card, and optional ISO/quality certificates |
| **AI-Assisted Verification** | OCR + LLM extracts structured data from uploaded documents |
| **External Lookup** | Cross-checks official Egyptian government sources via MCP servers |
| **Mandatory Human Review** | Verification Officer makes the final approval — AI is advisory only |
| **Account Lifecycle** | Pending → Verified → Active with status visible to the user at all times |
 
### 🔍 AI-Powered Prompt Search
| Feature | Description |
|---|---|
| **Natural Language Search** | Type your need in Arabic or English — no forms to fill |
| **Slot Extraction** | AI parses material type, quantity, price, location, and seller rating from your prompt |
| **Multi-Criteria Ranking** | Results scored by material match, price, distance, quantity fit, reputation, and freshness |
| **Explainability Chips** | Every result shows exactly why it ranked where it did |
| **Inline Refinement** | Edit extracted filters as chips without retyping the prompt |
| **Smart Alerts** | Save a prompt and get notified when new matching listings appear |
| **Manual Fallback** | Browse-Manually toggle for traditional filtered search |
 
### 📦 Listings & Marketplace
| Feature | Description |
|---|---|
| **Create Listing** | Title, category, material type, quantity, unit, price, MOQ, location, expiry |
| **Media Upload** | Up to 10 photos + 1 short video per listing |
| **Lab Reports** | Attach technical/lab analysis PDFs (composition, purity %) |
| **Draft / Publish / Schedule** | Full listing lifecycle management with version history |
| **AI Moderation** | Auto-scan for prohibited materials, duplicate posts, and suspicious pricing |
| **Auto-Expiry** | Listings expire after 60 days with renewal reminder |
 
### 💬 In-Platform Chat & Negotiation
| Feature | Description |
|---|---|
| **Real-time Chat** | SignalR-powered 1-to-1 messaging tied to a specific listing or RFQ |
| **Quote / Offer Messages** | Structured offer type (quantity, price, notes) — accepted offer converts directly to an order |
| **PII Guard** | Phone numbers, emails, and WhatsApp links are masked until an order is created |
| **Attachments** | Send images and PDF files (up to 10MB per file) |
| **Report & Flag** | Report messages or flag conversations for admin review |
| **Full History Retention** | Complete chat log retained and exportable on request |
 
### 📃 Contracts & Order Management
| Feature | Description |
|---|---|
| **Order Creation** | Accepted quote automatically generates a structured order with all agreed terms |
| **Order Summary** | Items, agreed price, quantity, delivery method, and expected delivery window |
| **Status Tracking** | Preparation → Shipped → Delivered with real-time status updates |
| **Proof of Delivery (POD)** | Signed receipt, photo, or carrier confirmation stored on the order |
| **Logistics Options** | Self-arranged pickup or partner carrier selection at checkout |
 
### 💰 Escrow Payments & Security
| Feature | Description |
|---|---|
| **Escrow Hold** | Buyer pays → funds held securely by the platform → seller ships → buyer confirms → funds released |
| **Auto-Release** | Funds automatically released after 7-day grace period if no dispute is raised |
| **Commission Engine** | Configurable commission % calculated on goods value only (not shipping) |
| **Payment Gateway** | Paymob / Fawry / bank transfer integration supporting cards, wallets, and bank transfers |
| **E-Invoice** | Egyptian Tax Authority-compliant electronic invoices generated for both parties |
| **Refund Flow** | Full or partial refund processed by admin upon dispute resolution |
 
### ⚖️ Disputes & Resolution
| Feature | Description |
|---|---|
| **Dispute Filing** | Buyer or seller can open a dispute within 7 days of delivery with evidence |
| **Evidence Collection** | Upload photos, videos, messages, and reports to support the case |
| **Escrow Freeze** | Funds automatically frozen when a dispute is opened |
| **Admin Review** | Support Agent reviews all evidence and proposes a resolution |
| **Escalation Path** | Open → Evidence → Admin Decision → Resolution (Refund / Release / Partial) |
| **Finance Admin Override** | Finance Admin issues a final binding decision if parties disagree |
 
### ⭐ Ratings & Reviews
| Feature | Description |
|---|---|
| **Mutual Rating** | Both buyer and seller rate each other (1–5 stars + comment) after each completed order |
| **Verified Reviews Only** | Reviews are gated to verified completed orders — no fake reviews |
| **Seller Reputation** | Rating and dispute rate factored into AI search ranking |
 
### 🔔 Notifications
| Feature | Description |
|---|---|
| **In-App Bell** | Real-time notifications for new messages, RFQs, order status, payouts, and disputes |
| **Email Notifications** | Configurable per event type |
| **SMS Alerts** | High-priority events (payout released, dispute opened) |
| **Preferences Page** | Per-channel and per-event notification control |
 
### 🏢 Company Dashboard
| Feature | Description |
|---|---|
| **Seller Dashboard** | Views, inquiries, conversion rate, revenue, and average rating |
| **Buyer Dashboard** | Spending history, top categories, and saved search performance |
| **Active Listings** | Manage all listings with status and analytics |
| **Order Management** | Track all active and completed orders |
| **Payout History** | View released funds and commission deductions |
| **Billing Info** | Edit bank account details (validated by Finance Admin before activation) |
 
---
 
## 🤖 AI Trinity
 
| Pillar | Implementation |
|---|---|
| **LLM** | AI Prompt Search + Chatbot Assistant |
| **RAG** | Vector DB + MCP servers connecting to Egyptian government sources for KYB verification |
| **Agents** | KYB Verification Agent, Buyer-Seller Matching Agent, Fraud Detection Agent |
 
> ⚠️ All AI decisions are **advisory only** — human approval is mandatory per BR-09 / BR-10.
> Every AI output displays: *"هذا اقتراح من الذكاء الاصطناعي — القرار النهائي للمسؤول"*
 
---
 
## Tech Stack
 
| Layer | Technology |
|---|---|
| Frontend Framework | Angular 22 — Standalone, Zoneless, Signal-first |
| Language | TypeScript 6 (strict mode) |
| Styling | Bootstrap 5 RTL + CSS Custom Properties |
| State Management | NgRx SignalStore |
| Real-time | SignalR (@microsoft/signalr) |
| Backend | ASP.NET Core Web API (.NET 9) |
| Database | SQL Server + Vector DB (RAG) |
| AI Services | LLM + OCR + MCP External Lookups |
| Queue | Redis / RabbitMQ |
| Payments | Paymob / Fawry / Geidea |
| Testing | Vitest |
 
---
 
## Architecture Highlights
 
- **Selectorless Components** — Angular 22 default, zero selector strings
- **Zoneless Change Detection** — no Zone.js overhead
- **Signal Forms** — replaces ReactiveFormsModule entirely
- **DTO → Adapter → UI Model** — API responses never bound directly to templates
- **InjectionToken pattern** — mock and real services swapped via DI, zero component changes
- **Feature-based folder structure** — no type-based grouping
---
 
## Project Structure
 
```
src/app/
├── core/
│   ├── interceptors/       # auth, error, loading
│   ├── guards/             # auth, kyb-status
│   ├── services/           # error, logger, toast
│   ├── tokens/             # InjectionTokens
│   └── constants/          # routes, app-wide constants
├── shared/
│   ├── components/         # button, skeleton, empty-state, badge
│   ├── pipes/              # currency-egp, relative-time
│   ├── directives/         # rtl-aware, lazy-image
│   └── validators/         # Signal Forms validators
├── features/
│   ├── auth/               # registration, login, OTP, KYB upload
│   ├── listings/           # create, edit, detail, my-listings
│   ├── search/             # AI prompt search, filters, chips
│   ├── chat/               # thread list, messages, quote-offer
│   ├── orders/             # summary, checkout, status tracker
│   ├── profile/            # company page, dashboard, billing
│   ├── disputes/           # open dispute, evidence, timeline
│   ├── notifications/      # bell, preferences
│   └── admin/              # KYB queue, moderation, escrow console
├── layout/
│   ├── header/
│   └── footer/
└── environments/
    ├── environment.ts
    └── environment.production.ts
```
 
---
 
## Sprint Plan
 
| Sprint | Theme | Story Points |
|---|---|---|
| Sprint 1 | Foundation, Auth & KYB, Listings, Search, Profiles | 86 |
| Sprint 2 | Chat, Orders, Escrow Payments, Logistics, Disputes | 88 |
| Sprint 3 | Full AI Layer, Reporting, Hardening | 87 |
| **Total** | | **261** |
 
---
 
## Getting Started
 
```bash
# Install dependencies
npm install
 
# Start development server
ng serve
```
 
Navigate to `http://localhost:4200/`
 
```bash
# Production build
ng build
 
# Run tests (Vitest)
ng test
```
 
---
 
## Further Reading
 
- [Software Requirements Specification v1.2](docs/Fayed_SRS_v1.2.docx)
- [Sprint Plan](docs/Fayed_Sprint_Plan.docx)
---
 
<div align="center">
  <sub>Built with ❤️ by The Optimizers Frontend Team — ITI Graduation Capstone 2026</sub>
</div>
 
