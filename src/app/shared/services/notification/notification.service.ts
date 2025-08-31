import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notificationsSubject = new BehaviorSubject<{ message: string; type: 'info' | 'success' | 'error' }[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  updateNotification(message: string, type: 'info' | 'success' | 'error') {
    const current = this.notificationsSubject.getValue();
    const newNotification = { message, type };
    this.notificationsSubject.next([...current, newNotification]);

    setTimeout(() => {
      const updated = this.notificationsSubject.getValue().filter(n => n !== newNotification);
      this.notificationsSubject.next(updated);
    }, 10000);
  }
}
