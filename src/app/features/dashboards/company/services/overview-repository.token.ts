import { InjectionToken } from '@angular/core';
import { DashboardSummary } from '../models/overview.model';

export interface OverviewRepository {
  getSummary(): Promise<DashboardSummary>;
}

export const OVERVIEW_REPOSITORY = new InjectionToken<OverviewRepository>(
  'OVERVIEW_REPOSITORY',
);
