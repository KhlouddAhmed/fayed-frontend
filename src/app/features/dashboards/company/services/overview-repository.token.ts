import { InjectionToken } from '@angular/core';
import { DashboardSummaryDto } from '../models/overview.model';

export interface OverviewRepository {
  getSummary(): Promise<DashboardSummaryDto>;
}

export const OVERVIEW_REPOSITORY = new InjectionToken<OverviewRepository>(
  'OVERVIEW_REPOSITORY',
);