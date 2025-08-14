import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'app-theme';

  constructor() {
    this.loadTheme();
  }

  setTheme(theme: string) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.THEME_KEY, theme);
  }

  getTheme(): string | null {
    return localStorage.getItem(this.THEME_KEY);
  }

  loadTheme() {
    const storedTheme = this.getTheme();
    if (storedTheme) {
      this.setTheme(storedTheme);
    }
  }
}
