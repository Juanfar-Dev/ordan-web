import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  {
    path: 'home',
    data: { breadcrumb: 'Inicio' },
    loadComponent: () =>
      import('./features/home/home.component').then(m => m.HomeComponent),
    children: [
      // TO DO: ruta hija por defecto (opcional pero recomendable)

      {
        path: 'invoices',
        data: { breadcrumb: 'Facturas' },
        loadComponent: () =>
          import('./features/invoices/invoices.component').then(m => m.InvoicesComponent),
      },
      {
        path: 'accounts',
        data: { breadcrumb: 'Cuentas' },
        loadComponent: () =>
          import('./features/accounts/account-list/accounts.component').then(m => m.AccountsComponent),
      },
      {
        path: 'accounts/:id',
        data: { breadcrumb: 'Cuenta Detalle' },
        loadComponent: () =>
          import('./features/accounts/account-list/accounts.component').then(m => m.AccountsComponent),
      },
       {
        path: 'new-accounts',
        data: { breadcrumb: 'Nueva Cuenta' },
        loadComponent: () =>
          import('./features/accounts/account-create/account-create.component').then(m => m.AccountCreateComponent),
      },
      {
        path: 'profile',
        data: { breadcrumb: 'Perfil' },
        loadComponent: () =>
          import('./features/profile/profile.component').then(m => m.ProfileComponent),
      },
      {
        path: 'settings',
        data: { breadcrumb: 'Configuración' },
        loadComponent: () =>
          import('./features/settings/settings.component').then(m => m.SettingsComponent),
      },
    ],
  },
];
