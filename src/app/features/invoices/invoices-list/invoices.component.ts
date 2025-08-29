import {
  Component,
  ElementRef,
  inject,
  ViewChild,
  OnInit,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPlus,
  faEye,
  faPencil,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';
import { InvoicesService } from '../invoices.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Invoice } from '../invoice';
import { InvoiceTemplateComponent } from '../invoice-template/invoice-template.component';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-invoices',
  imports: [FontAwesomeModule, CommonModule, InvoiceTemplateComponent],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css',
})
export class InvoicesComponent {
  public route = inject(ActivatedRoute);
  public router = inject(Router);
  public invoicesService = inject(InvoicesService);
  public invoices: any[] = [];
  public loading = false;
  faPlus = faPlus;
  faEye = faEye;
  faPencil = faPencil;
  faDownload = faDownload;
  // public invoices$ = this.invoicesService.getMockInvoices();
  public invoices$ = this.route.queryParamMap.pipe(
    // Import map and switchMap from rxjs if not already imported
    map(params => params.get('account_id')),
    switchMap(accountId =>
      accountId
        ? this.invoicesService.getInvoicesByAccountId(accountId)
        : this.invoicesService.getInvoices()
        // : this.invoicesService.getMockInvoices()
    )
  );

  public invoiceData: Invoice | null = null;

  @ViewChild('invoiceContainer') invoiceContainer!: ElementRef;


  onCreateInvoice() {
    this.router.navigate(['new-invoice'], { relativeTo: this.route });
  }

  onViewInvoiceDetails(invoice_id_short: string) {
    this.router.navigate(['invoice', invoice_id_short], {
      relativeTo: this.route,
    });
  }

  async downloadPDF(invoiceData: Invoice) {
    this.invoiceData = invoiceData;
    if (this.invoiceData) {
      await this.generatePDF();
    }
  }

  generatePDF() {
    const elementToPrint = this.invoiceContainer.nativeElement;

    html2canvas(elementToPrint!, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      const fileName = `factura_${this.invoiceData?.invoice_number}_${this.invoiceData?.account_alias}.pdf`;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(fileName);
    });
  }
}
