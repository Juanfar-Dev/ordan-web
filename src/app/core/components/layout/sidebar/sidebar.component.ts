import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../../services/theme.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { map, Observable, shareReplay } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, FontAwesomeModule, CommonModule, NgOptimizedImage],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  isDarkMode = false;
  isMenuOpen = false;
  isMobile = true;
  itemMenuVisible = true;
  faGear = faGear;
  faUser = faUser;
  faCircleUser = faCircleUser;
  faRightFromBracket = faRightFromBracket;

  private authService = inject(AuthService);
  public theme: string | null =
    document.documentElement.getAttribute('data-theme');

  public user$: Observable<{ name: string; letters: string } | null> =
    this.authService.getUser().pipe(
      map((user) =>
        user
          ? {
              name: `${user.name} ${user.surname}`,
              letters: `${user.name.charAt(0)}${user.surname.charAt(0)}`,
            }
          : null
      ),
      shareReplay(1)
    );

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    const currentTheme = this.themeService.getTheme();
    this.isDarkMode = currentTheme === 'dark';
    this.onSmallScreen();
  }

  onSmallScreen() {
    const mediaQuery = window.matchMedia('(min-width: 640px)');
    if (mediaQuery.matches) {
      this.isMobile = false;
      this.isMenuOpen = true;
    } else {
      this.isMobile = true;
      this.isMenuOpen = false;
    }

    mediaQuery.addEventListener('change', (e) => {
      if (e.matches) {
        this.isMobile = false;
        this.isMenuOpen = false;
      } else {
        this.isMobile = true;
        this.isMenuOpen = true;
      }
      this.blockScroll();
    });
  }

  onToggleTheme(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.checked) {
      this.themeService.setTheme('dark'); // Tema oscuro
      this.isDarkMode = true;
    } else {
      this.themeService.setTheme('light'); // Tema claro
      this.isDarkMode = false;
    }
  }

  onToggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.blockScroll();
  }

  blockScroll() {
    const body = document.body;
    body.style.overflow = 'hidden';
    if (this.isMenuOpen) {
      body.style.overflow = 'hidden'; // Evita el desplazamiento del cuerpo
    } else {
      body.style.overflow = 'auto'; // Restaura el desplazamiento del cuerpo
    }
  }
}
