import { Component, inject } from '@angular/core';
import { SidebarComponent } from '../../core/components/layout/sidebar/sidebar.component';
import { HeaderComponent } from '../../core/components/layout/header/header.component';
import { BreadcrumbComponent } from '../../core/components/layout/breadcrumbs/breadcrumb.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NotificationService } from '../../shared/services/notification/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, RouterOutlet, SidebarComponent,HeaderComponent, BreadcrumbComponent],
templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private notificationService = inject(NotificationService);
  public notifications$ = this.notificationService.notifications$;
}
