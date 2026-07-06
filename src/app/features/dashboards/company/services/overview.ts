import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponseWithData } from '../../../../core/models/api-response.model';
import {
  DashboardOverviewDto,
  DashboardStatsDto,
  DashboardSummary,
} from '../models/overview.model';
import { adaptDashboardSummary } from '../adapters/overview.adapter';
import { AuthStateService } from '../../../../core/services/auth-state.service';

@Injectable({ providedIn: 'root' })
export class OverviewService {
  private readonly http = inject(HttpClient);
  private readonly authState = inject(AuthStateService);

  getSummary(): Observable<DashboardSummary> {
    const stats$ = this.http.get<ApiResponseWithData<DashboardStatsDto>>(
      `${environment.apiUrl}/dashboard/stats`
    );

    const overview$ = this.http.get<ApiResponseWithData<DashboardOverviewDto>>(
      `${environment.apiUrl}/dashboard/overview`
    );

    return forkJoin({ stats: stats$, overview: overview$ }).pipe(
      map(({ stats, overview }) =>
        adaptDashboardSummary(
          this.authState.currentUser()?.name ?? '',
          stats.Data!,
          overview.Data!
        )
      )
    );
  }
}