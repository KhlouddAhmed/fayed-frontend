import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';

import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

import { AUTH_SERVICE } from './core/tokens/auth.token';
import { AuthService } from './features/auth/services/auth';

import { OVERVIEW_REPOSITORY } from './features/dashboards/company/services/overview-repository.token';
import { MockOverviewRepository } from './features/dashboards/company/services/mock-overview-repository';
import { MATERIALS_REPOSITORY } from './features/dashboards/company/services/materials-repository.token';
import { MockMaterialsRepository } from './features/dashboards/company/services/mock-materials-repository';
import { RFQ_OFFER_REPOSITORY } from './features/dashboards/company/services/rfq-offer-repository.token';
import { MockRfqOfferRepository } from './features/dashboards/company/services/mock-rfq-offer-repository';
import { ORDERS_REPOSITORY } from './features/dashboards/company/services/orders-repository.token';
import { MockOrdersRepository } from './features/dashboards/company/services/mock-orders-repository';
import { DISPUTE_REPOSITORY } from './features/dashboards/company/services/dispute-repository.token';
import { MockDisputeRepository } from './features/dashboards/company/services/mock-dispute-repository';
import { MESSAGES_REPOSITORY } from './features/dashboards/company/services/messages-repository.token';
import { MockMessagesRepository } from './features/dashboards/company/services/mock-messages-repository';
import { RealMaterialsRepository } from './features/dashboards/company/services/real-materials-repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),

    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      })
    ),

    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor])
    ),

    // AUTH_SERVICE token → AuthService (has login() + logout())
    { provide: AUTH_SERVICE, useExisting: AuthService },

    { provide: OVERVIEW_REPOSITORY,  useClass: MockOverviewRepository  },
    { provide: MATERIALS_REPOSITORY, useClass: MockMaterialsRepository },
    { provide: RFQ_OFFER_REPOSITORY, useClass: MockRfqOfferRepository  },
    { provide: ORDERS_REPOSITORY,    useClass: MockOrdersRepository    },
    { provide: DISPUTE_REPOSITORY,   useClass: MockDisputeRepository   },
    { provide: MESSAGES_REPOSITORY,  useClass: MockMessagesRepository  },

    { provide: MATERIALS_REPOSITORY, useClass: RealMaterialsRepository }
  ],
};