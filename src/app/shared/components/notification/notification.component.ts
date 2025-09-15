import { Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification/notification.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  imports: [CommonModule, RouterModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  private notificationService = inject(NotificationService);
  public notifications$ = this.notificationService.notifications$;
  public progressValue = 100;

  removeNotification(index: number) {
    this.notificationService.removeNotification(index);
  }
}
