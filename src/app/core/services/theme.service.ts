import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  setTheme(theme: string) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  getTheme(): string | null {
    return document.documentElement.getAttribute('data-theme');
  }
}
