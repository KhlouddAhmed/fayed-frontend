import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { NotificationDropdownPanel } from '../notification-dropdown-panel/notification-dropdown-panel';

@Component({
  selector: 'app-notification-bell',
  templateUrl: './notification-bell.html',
  styleUrl: './notification-bell.css',
  imports: [NotificationDropdownPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationBell {

  // DEPENDENCIES & STATE
  private readonly elementRef = inject(ElementRef);

  protected readonly isOpen = signal(false);
  protected readonly unreadCount = signal(3);

  // METHODS
  protected toggle(): void {
    this.isOpen.update((v) => !v);
  }

  // Close panel when clicking outside
  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}