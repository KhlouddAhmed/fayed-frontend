import { InjectionToken } from '@angular/core';
import { CreateDisputeRequestDto, DisputeDto, NegotiationMessageDto } from '../models/dispute.model';

export interface DisputeRepository {
  getAll(): Promise<readonly DisputeDto[]>;
  getNegotiationLog(disputeId: string): Promise<readonly NegotiationMessageDto[]>;
  create(request: CreateDisputeRequestDto): Promise<DisputeDto>;
}

export const DISPUTE_REPOSITORY = new InjectionToken<DisputeRepository>(
  'DISPUTE_REPOSITORY',
);