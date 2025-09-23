import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Notification } from '../notification';

@Component({
  selector: 'app-notification-item',
  imports: [CommonModule],
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.css'],
})
export class NotificationItemComponent implements OnChanges {
  @Input() notification!: Notification;
  @Output() remove = new EventEmitter<Notification>();
  private duration: number = 10000;
  counter: number = 0;
  private intervalId: any;

  ngOnChanges(simpleChanges: any) {
    if (simpleChanges.notification) {
      this.notification = simpleChanges.notification.currentValue;
      this.countDownToRemove();
    }
  }

  countDownToRemove() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    const interval = 100;
    const decrement = (interval / this.duration) * 100;

    const updatePercent = () => {
      if (this.notification.percent !== undefined) {
        if (this.notification.percent <= 0) {
          this.removeNotification();
          return;
        }
        this.notification.percent = Math.max(0, (this.notification.percent ?? 0) - decrement);
      }
    };

    this.intervalId = setInterval(updatePercent, interval);
  }

  removeNotification() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.remove.emit(this.notification);
  }
}
