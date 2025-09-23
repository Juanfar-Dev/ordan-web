import { Component, inject } from '@angular/core';
import { NotificationService } from '../../../services/notification/notification.service';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { NotificationItemComponent } from '../notification-item/notification-item.component';
import { Notification } from '../notification';

@Component({
  selector: 'app-notification-list',
  imports: [CommonModule, NotificationItemComponent],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.css',
})
export class NotificationListComponent {
private notificationService = inject(NotificationService);
  public notifications$ = this.notificationService.notifications$;

  eliminar(notification: Notification) {
    this.notificationService.removeNotification(notification);
  }
}
