import { Component } from '@angular/core';
import { SidebarComponent } from '../../core/components/layout/sidebar/sidebar.component';
import { HeaderComponent } from '../../core/components/layout/header/header.component';
import { BreadcrumbComponent } from '../../core/components/layout/breadcrumbs/breadcrumb.component';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterModule, RouterOutlet, SidebarComponent,HeaderComponent, BreadcrumbComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
