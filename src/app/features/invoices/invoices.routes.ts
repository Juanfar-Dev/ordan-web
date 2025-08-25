import { Routes } from '@angular/router';

export default [
  {
    path: '',
    data: { breadcrumb: '' },
    loadComponent: () =>
      import('./invoices-list/invoices.component').then(
        (m) => m.InvoicesComponent
      ),
  },
  {
    path: 'invoice/:id',
    data: { breadcrumb: 'Detalle Factura' },
    loadComponent: () =>
      import('../invoices/invoices-list/invoices.component').then(
        (m) => m.InvoicesComponent
      ),
  },
  {
    path: 'new-invoice',
    data: { breadcrumb: 'Nueva Factura' },
    loadComponent: () =>
      import('./invoice-create/invoice-create.component').then(
        (m) => m.InvoiceCreateComponent
      ),
  },
] as Routes;
