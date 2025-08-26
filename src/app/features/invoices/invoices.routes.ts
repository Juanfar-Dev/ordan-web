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
    path: 'new-invoice',
    data: { breadcrumb: 'Nueva Factura' },
    loadComponent: () =>
      import('./invoice-form/invoice-form.component').then(
        (m) => m.InvoiceFormComponent
      ),
  },
  {
    path: 'invoice/:id',
    data: { breadcrumb: 'Detalles de Factura' },
    loadComponent: () =>
      import('./invoice-form/invoice-form.component').then(
        (m) => m.InvoiceFormComponent
      ),
  },
] as Routes;
