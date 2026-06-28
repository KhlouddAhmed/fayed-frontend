import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ActivityItem } from '../../models/overview.model';
import { RelativeTimePipe } from '../../../../../shared/pipes/relative-time.pipe';

@Component({
  selector: 'app-recent-activity-feed',
  imports: [RelativeTimePipe],
  templateUrl: './recent-activity-feed.html',
  styleUrl: './recent-activity-feed.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentActivityFeed {
  readonly activities = input.required<readonly ActivityItem[]>();
}
