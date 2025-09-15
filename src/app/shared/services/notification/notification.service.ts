import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private modalSubject = new BehaviorSubject<boolean>(false);
  isModalOpen$ = this.modalSubject.asObservable();

  private notificationsSubject = new BehaviorSubject<{ message: string; style: 'info' | 'success' | 'error'; percent?: number }[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  updateNotification(message: string, style: 'info' | 'success' | 'error', time: number = 10000) {
    const current = this.notificationsSubject.getValue();
    const newNotification = { message, style, percent: 100 };
    this.notificationsSubject.next([...current, newNotification]);

    const per = 100;
    const intervalId = setInterval(() => {
      const updated = this.notificationsSubject.getValue();
      updated.forEach(n => {
        if (n === newNotification && n.percent !== undefined) {
          n.percent = Math.max(0, n.percent - this.timeToPercentage(per, time));
        }
      });
      this.notificationsSubject.next(updated);
    }, 100);

    setTimeout(() => {
      clearInterval(intervalId);
      const updated = this.notificationsSubject.getValue().filter(n => n !== newNotification);
      this.notificationsSubject.next(updated);
    }, time);
  }

  timeToPercentage(time: number, total: number): number {
    return (time / total) * 100;
  }

  removeNotification(index: number) {
    const current = this.notificationsSubject.getValue();
    current.splice(index, 1);
    this.notificationsSubject.next([...current]);
  }
}
