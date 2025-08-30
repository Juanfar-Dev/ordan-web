import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../auth/auth.service';
import { map, Observable, shareReplay } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  public user$: Observable<string | null> = this.authService.getUser().pipe(
    map((user) => user ? `${user.name} ${user.surname}` : ''),
    shareReplay(1)
  );

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
