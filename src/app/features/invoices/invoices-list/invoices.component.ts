import { Component, ElementRef, inject, QueryList, ViewChildren } from '@angular/core';
import { fadeInDown } from '../../../core/animations/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPlus,
  faEye,
  faPencil,
  faDownload,
  faFileInvoiceDollar,
  faPenToSquare
} from '@fortawesome/free-solid-svg-icons';
import { InvoicesService } from '../invoices.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceTemplateComponent } from '../invoice-template/invoice-template.component';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-invoices',
  imports: [FontAwesomeModule, CommonModule, InvoiceTemplateComponent],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css',
  animations: [fadeInDown],
})
export class InvoicesComponent {
  public route = inject(ActivatedRoute);
  public router = inject(Router);
  public invoicesService = inject(InvoicesService);
  public loading = false;
  faPlus = faPlus;
  faEye = faEye;
  faPencil = faPencil;
  faDownload = faDownload;
  faFileInvoiceDollar = faFileInvoiceDollar;
  faPenToSquare = faPenToSquare;

  public account_literal = 'No hay facturas disponibles.';
  // public invoices$ = this.invoicesService.getMockInvoices();
  public invoices$ = this.route.queryParamMap.pipe(
    // Import map and switchMap from rxjs if not already imported
    map((params) => [params.get('account_id'), params.get('account_name')]),
    switchMap(([accountId, accountName]) => {
      if (accountId) {
        this.account_literal = `No hay facturas disponibles para la cuenta <strong>${accountName}</strong>.`;
        return this.invoicesService.getInvoicesByAccountId(accountId);
      } else {
        return this.invoicesService.getInvoices();
      }
    })
  );

  @ViewChildren('invoice_modal') invoiceModals!: QueryList<ElementRef<HTMLDialogElement>>;


  onCreateInvoice() {
    this.router.navigate(['new-invoice'], { relativeTo: this.route });
  }

  onViewInvoiceDetails(invoice_id_short: string) {
    this.router.navigate(['invoice', invoice_id_short], {
      relativeTo: this.route,
    });
  }

  onOutputData(event: { feedback: string; data?: any }, index: number) {
    const dlg = this.invoiceModals.toArray()[index];
    dlg?.nativeElement.close();

  }
}
