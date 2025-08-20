import { Routes } from "@angular/router";

export default [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  {
    path: 'signup',
    loadComponent: () => import('./signup/signup.component').then(m => m.default)
  },
  {
    path: 'signin',
    loadComponent: () => import('./signin/signin.component').then(m => m.default)
  }
] as Routes;
