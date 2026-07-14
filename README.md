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

---

## About the Project

FAYED is a specialized **B2B online marketplace** in Egypt that connects verified industrial companies to buy and sell surplus raw materials and production by-products, promoting a circular economy.

**Key Highlights**:
- Single company account per owner (no internal RBAC in MVP)
- AI-Powered Prompt Search as primary discovery method
- KYB verification with AI assistance + mandatory human review
- Secure in-platform chat, Escrow payments, and dispute resolution
- Fully RTL Arabic-first interface

**Latest SRS**: Version 1.2 (May 2026)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | Angular 22 — Standalone, Zoneless, Signal-first |
| Language | TypeScript 6 (strict mode) |
| Styling | Bootstrap 5 RTL + CSS Custom Properties |
| State Management | NgRx SignalStore |
| Real-time | SignalR (@microsoft/signalr) |
| Backend | ASP.NET Core Web API (.NET 8) |
| Database | SQL Server + Vector DB (RAG) |
| AI Services | LLM + OCR + MCP External Lookups |
| Queue | Redis / RabbitMQ |

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

## Sprint Plan Summary

| Sprint | Theme | Story Points |
|---|---|---|
| Sprint 1 | Foundation, Auth & KYB, Listings, Search, Profiles | 86 |
| Sprint 2 | Chat, Orders, Escrow Payments, Logistics, Disputes | 88 |
| Sprint 3 | Full AI Layer, Reporting, Hardening | 87 |
| **Total** | | **261** |

---

## Key Features (MVP)

- **Company Registration & KYB** — 3-step onboarding with document upload and AI-assisted verification
- **AI Prompt Search** — natural language search with slot extraction, multi-criteria ranking, and explainability chips
- **Listings** — create with media, lab reports, draft/publish flow, auto-expiry
- **Real-time Chat** — SignalR-powered with quote/offer messages and PII guard
- **Escrow Payments** — secure hold/release flow via Paymob/Fawry integration
- **Dashboards** — seller and buyer analytics, order tracking, payout history
- **Ratings & Disputes** — post-order reviews and evidence-based dispute resolution
- **Notifications** — in-app bell + email with per-event preferences

---

## AI Trinity

| Pillar | Implementation |
|---|---|
| LLM | AI Prompt Search + Chatbot Assistant |
| RAG | Vector DB + MCP servers connecting to Egyptian government sources |
| Agents | KYB Verification Agent, Matching Agent, Fraud Detection Agent |

> All AI decisions are advisory only — human approval is mandatory (BR-09 / BR-10)

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
