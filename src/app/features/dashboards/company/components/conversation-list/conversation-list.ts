import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Conversation } from '../../models/messages.model';
import { RelativeTimePipe } from '../../../../../shared/pipes/relative-time.pipe';

@Component({
  selector: 'app-conversation-list',
  imports: [RelativeTimePipe],
  templateUrl: './conversation-list.html',
  styleUrl: './conversation-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationList {
  readonly conversations = input.required<readonly Conversation[]>();
  readonly activeConversationId = input<string | null>(null);
  readonly selectConversation = output<string>();
}
