import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationListComponent } from './shared/components/notifications/notification-list/notification-list.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

}
