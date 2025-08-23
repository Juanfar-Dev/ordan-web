import { Routes } from '@angular/router';
import { privateGuard, publicGuard } from './core/guards/auth.guards';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'auth',
    canActivate: [publicGuard],
    loadChildren: () =>
      import('./core/auth/auth.routes').then((m) => m.default),
  },
  {
    path: 'home',
    canActivate: [privateGuard],
    data: { breadcrumb: 'Inicio' },
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
    children: [
      // TO DO: ruta hija por defecto (opcional pero recomendable)
      {
        path: 'accounts',
        data: { breadcrumb: 'Cuentas' },
        loadChildren: () =>
          import('./features/accounts/accounts.routes').then((m) => m.default),
      },
      {
        path: 'invoices',
        data: { breadcrumb: 'Facturas' },
        loadComponent: () =>
          import('./features/invoices/invoices.component').then(
            (m) => m.InvoicesComponent
          ),
      },
      {
        path: 'profile',
        data: { breadcrumb: 'Perfil' },
        loadComponent: () =>
          import('./features/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },
      {
        path: 'settings',
        data: { breadcrumb: 'Configuración' },
        loadComponent: () =>
          import('./features/settings/settings.component').then(
            (m) => m.SettingsComponent
          ),
      },
    ],
  },
];
