import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private modalSubject = new BehaviorSubject<boolean>(false);
  isModalOpen$ = this.modalSubject.asObservable();

  private notificationsSubject = new BehaviorSubject<{ message: string; style: 'info' | 'success' | 'error' }[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  updateNotification(message: string, style: 'info' | 'success' | 'error', time: number = 10000) {
    const current = this.notificationsSubject.getValue();
    const newNotification = { message, style };
    this.notificationsSubject.next([...current, newNotification]);

    setTimeout(() => {
      const updated = this.notificationsSubject.getValue().filter(n => n !== newNotification);
      this.notificationsSubject.next(updated);
    }, time);
  }
}
