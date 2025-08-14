import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../../services/theme.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, FontAwesomeModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  isDarkMode = false;
  isMenuOpen = false;
  itemMenuVisible = true;
  faGear = faGear;
  faUser = faUser;
  faCircleUser = faCircleUser;
  faRightFromBracket = faRightFromBracket;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    const currentTheme = this.themeService.getTheme();
    this.isDarkMode = currentTheme === 'dark';
    this.onSmallScreen();
  }

  onSmallScreen() {
    const mediaQuery = window.matchMedia('(min-width: 640px)');
    if (mediaQuery.matches) {
      this.isMenuOpen = false;
    }

    mediaQuery.addEventListener('change', (e) => {
      if (e.matches) {
        this.isMenuOpen = false;
      }
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
    this.itemMenuVisible = false;

    setTimeout(() => {
      this.itemMenuVisible = true;
    }, 500);
  }
}
