import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
// =============================================================================
// COMPANY DASHBOARD — REPOSITORY TOKENS & MOCKS
// =============================================================================
// Overview Page: KPI stats, recent activity, recent orders
import { OVERVIEW_REPOSITORY } from './features/dashboards/company/services/overview-repository.token';
import { MockOverviewRepository } from './features/dashboards/company/services/mock-overview-repository';
// My Listings Page: company's own materials/products management
import { MATERIALS_REPOSITORY } from './features/dashboards/company/services/materials-repository.token';
import { MockMaterialsRepository } from './features/dashboards/company/services/mock-materials-repository';
// RFQ Offers Page: sent/received offers, offer details
import { RFQ_OFFER_REPOSITORY } from './features/dashboards/company/services/rfq-offer-repository.token';
import { MockRfqOfferRepository } from './features/dashboards/company/services/mock-rfq-offer-repository';
// =============================================================================
// APPLICATION CONFIGURATION
// =============================================================================
export const appConfig: ApplicationConfig = {
  providers: [
    // -------------------------------------------------------------------------
    // ANGULAR CORE PROVIDERS
    // -------------------------------------------------------------------------
    // Zoneless change detection (Angular 22 default — no Zone.js overhead)
    provideZonelessChangeDetection(),
    // Global error listeners for unhandled errors and promise rejections
    provideBrowserGlobalErrorListeners(),
    // -------------------------------------------------------------------------
    // ROUTING
    // -------------------------------------------------------------------------
    // Router with smooth scrolling behavior for anchor links and navigation
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      })
    ),
    // -------------------------------------------------------------------------
    // HTTP CLIENT
    // -------------------------------------------------------------------------
    // HttpClient for API calls (interceptors can be added here later)
    provideHttpClient(),
    // -------------------------------------------------------------------------
    // COMPANY DASHBOARD — REPOSITORY PROVIDERS
    // Swap Mock → Real implementation when .NET 8 backend is ready
    // -------------------------------------------------------------------------
    // Overview Page: dashboard summary data (KPIs, activity, orders)
    { provide: OVERVIEW_REPOSITORY, useClass: MockOverviewRepository },
    // My Listings Page: CRUD operations for company's materials
    { provide: MATERIALS_REPOSITORY, useClass: MockMaterialsRepository },
    // RFQ Offers Page: manage sent/received RFQ offers
    { provide: RFQ_OFFER_REPOSITORY, useClass: MockRfqOfferRepository },
  ],
};
