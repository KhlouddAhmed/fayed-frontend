import { InjectionToken } from '@angular/core';
import { ContractDto, ConversationDto, MessageDto } from '../models/messages.model';

export interface MessagesRepository {
  getConversations(): Promise<readonly ConversationDto[]>;
  getMessages(conversationId: string): Promise<readonly MessageDto[]>;
  sendMessage(conversationId: string, content: string): Promise<MessageDto>;
  getContract(conversationId: string): Promise<ContractDto | null>;
  createContract(conversationId: string): Promise<ContractDto>;
  acceptAmendment(contractId: string): Promise<ContractDto>;
  requestAmendment(contractId: string, newTerms: string): Promise<ContractDto>;
  signContract(contractId: string, authorizedName: string): Promise<ContractDto>;
}

export const MESSAGES_REPOSITORY = new InjectionToken<MessagesRepository>(
  'MESSAGES_REPOSITORY',
);
