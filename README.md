# FayedFrontend

**فايض | FAYED**  
**B2B Marketplace for Industrial Surplus & Production By-Products**  
**سوق إلكتروني لبيع وشراء فائض المواد الخام وهدر الإنتاج بين المصانع**

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.0.1.

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

- **Frontend**: Angular 22 (Standalone, Zoneless, Signals, Signal Forms)
- **Language**: TypeScript 6 (strict mode)
- **Styling**: Bootstrap 5 + Tailwind CSS (RTL-first)
- **State Management**: NgRx SignalStore
- **Real-time**: SignalR
- **Backend**: .NET 8 (API)
- **AI Services**: LLM + OCR + MCP external lookups

---

## Development server

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload on file changes.

## Code Scaffolding

```bash
ng generate component component-name
```

For a full list of schematics:

```bash
ng generate --help
```

---

## Project Structure

```bash
src/app/
├── core/                  # Core services, interceptors, config
├── shared/                # Reusable components, pipes, directives
├── features/
│   ├── auth/
│   ├── listings/
│   ├── search/            # AI Prompt Search + results
│   ├── chat/
│   ├── orders/
│   ├── profile/
│   └── admin/             # KYB queue, moderation, etc.
├── store/                 # NgRx SignalStore slices
└── models/                # Shared interfaces & types
```

---

## Sprint Plan Summary

- **Sprint 1**: Foundation, Auth & KYB, Listings, Traditional Search, Profiles
- **Sprint 2**: Chat, Orders, Escrow Payments, Logistics, Disputes
- **Sprint 3**: Full AI Layer (Prompt Search + KYB), Reporting, Hardening

---

## Key Features (MVP)

- Company Registration & Document Verification
- AI Prompt Search with explainability
- Listing creation with media & lab reports
- Real-time chat with quote support
- Escrow-based secure payments + E-Invoice
- Seller & Buyer dashboards
- Ratings, Reviews & Dispute management

---

## Running the Project

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   ng serve
   ```

---

## Build

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

---

## Further Reading

- [Software Requirements Specification (SRS)](docs/Fayed_SRS_v1.2.docx)
- [Sprint Plan](docs/Fayed_Sprint_Plan.docx)

