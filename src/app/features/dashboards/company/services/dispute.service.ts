import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponseWithData } from '../../../../core/models/api-response.model';
import {
  DisputeDto,
  Dispute,
  NegotiationMessageDto,
  NegotiationMessage,
  CreateDisputeRequestDto,
} from '../models/dispute.model';
import {
  adaptDisputes,
  adaptDispute,
  adaptNegotiationMessages,
} from '../adapters/dispute.adapter';

@Injectable({ providedIn: 'root' })
export class DisputeService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<readonly Dispute[]> {
    return this.http
      .get<ApiResponseWithData<readonly DisputeDto[]>>(`${environment.apiUrl}/disputes`)
      .pipe(map(res => adaptDisputes(res.data ?? [])));
  }

  getNegotiationLog(disputeId: string): Observable<readonly NegotiationMessage[]> {
    return this.http
      .get<ApiResponseWithData<readonly NegotiationMessageDto[]>>(
        `${environment.apiUrl}/disputes/${disputeId}`
      )
      .pipe(map(res => adaptNegotiationMessages(res.data ?? [])));
  }

  create(request: CreateDisputeRequestDto): Observable<Dispute> {
    return this.http
      .post<ApiResponseWithData<DisputeDto>>(`${environment.apiUrl}/disputes`, request)
      .pipe(map(res => adaptDispute(res.data!)));
  }
}