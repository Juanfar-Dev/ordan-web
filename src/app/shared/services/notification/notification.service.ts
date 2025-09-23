import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification } from '../../components/notifications/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<
    Notification[]
  >([]);
  notifications$ = this.notificationsSubject.asObservable();
  private nextId = 0;

  updateNotification (
    message: string,
    style: 'info' | 'success' | 'error',
    duration: number = 10000,
  ) {
    const notifications = this.notificationsSubject.getValue();
    notifications.push({ message, style, percent: 100 });
    this.notificationsSubject.next([...notifications]);
  }

  removeNotification(notification: Notification) {
    const updated = this.notificationsSubject
      .getValue()
      .filter((n) => n !== notification);
    this.notificationsSubject.next(updated);
  }
}
