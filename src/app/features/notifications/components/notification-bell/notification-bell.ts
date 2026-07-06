import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, OnInit, signal } from '@angular/core';
import { NotificationDropdownPanel } from '../notification-dropdown-panel/notification-dropdown-panel';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-notification-bell',
  templateUrl: './notification-bell.html',
  styleUrl: './notification-bell.css',
  imports: [NotificationDropdownPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationBell implements OnInit {
  private readonly elementRef = inject(ElementRef);
  private readonly notificationsService = inject(NotificationsService);

  protected readonly isOpen = signal(false);
  protected readonly unreadCount = signal(0);

  ngOnInit(): void {
    this.notificationsService.getUnreadCount().subscribe({
      next: count => this.unreadCount.set(count),
    });
  }

  protected toggle(): void {
    this.isOpen.update((v) => !v);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}