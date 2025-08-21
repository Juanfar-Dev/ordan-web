import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule, FontAwesomeModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  faGear = faGear;
  faUser = faUser;
  faCircleUser = faCircleUser;
  faRightFromBracket = faRightFromBracket;

  async signOut() {
    try {
      await this.authService.signout();
      localStorage.removeItem('user');
      localStorage.removeItem('session');
      this.router.navigate(['/auth/signin']);
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  }
}
