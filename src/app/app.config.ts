import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { OVERVIEW_REPOSITORY } from './features/dashboards/company/services/overview-repository.token';
import { MockOverviewRepository } from './features/dashboards/company/services/mock-overview-repository';
import { routes } from './app.routes';

//lisitng in company dashboard 
import { MATERIALS_REPOSITORY } from './features/dashboards/company/services/materials-repository.token';
import { MockMaterialsRepository } from './features/dashboards/company/services/mock-materials-repository';

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
    provideHttpClient(),
    { provide: OVERVIEW_REPOSITORY, useClass: MockOverviewRepository },
    { provide: MATERIALS_REPOSITORY, useClass: MockMaterialsRepository } //lising in company dashboard
  ],
  
};