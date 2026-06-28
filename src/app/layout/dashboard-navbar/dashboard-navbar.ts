import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-dashboard-navbar',
  templateUrl: './dashboard-navbar.html',
  styleUrl: './dashboard-navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardNavbar {
  readonly companyName = input.required<string>();
  readonly companyCode = input.required<string>();
  readonly avatarInitial = input.required<string>();
  readonly hasUnreadNotifications = input<boolean>(false);
}
