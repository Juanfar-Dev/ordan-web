import { Routes } from '@angular/router';

export default [
  {
    path: '',
    data: { breadcrumb: '' },
    loadComponent: () =>
      import('./account-list/accounts.component').then(
        (m) => m.AccountsComponent
      ),
  },
  {
    path: 'accounts/:id',
    data: { breadcrumb: 'Cuenta Detalle' },
    loadComponent: () =>
      import('./account-list/accounts.component').then(
        (m) => m.AccountsComponent
      ),
  },
  {
    path: 'new-accounts',
    data: { breadcrumb: 'Nueva Cuenta' },
    loadComponent: () =>
      import('./account-create/account-create.component').then(
        (m) => m.AccountCreateComponent
      ),
  },
] as Routes;
