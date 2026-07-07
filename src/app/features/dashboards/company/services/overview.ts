import { inject, Injectable } from '@angular/core';
import { DashboardSummary } from '../models/overview.model';
import { adaptDashboardSummary } from '../adapters/overview.adapter';
import { OVERVIEW_REPOSITORY } from './overview-repository.token';

@Injectable()
export class OverviewService {
  private readonly repository = inject(OVERVIEW_REPOSITORY);

  async getSummary(): Promise<DashboardSummary> {
    const dto = await this.repository.getSummary();
    return adaptDashboardSummary(dto);
  }
}