import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { InvoicesService } from '../invoices.service';
import { AuthService } from '../../../core/auth/auth.service';
import { AccountsService } from '../../accounts/accounts.service';
import { faThumbsDown, faThumbsUp, faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-invoice-template',
  imports: [FontAwesomeModule],
  templateUrl: './invoice-template.component.html',
  styleUrl: './invoice-template.component.css',
})
export class InvoiceTemplateComponent {
  @Input() public type: 'preview' | 'approve' = 'preview';
  @Input() public inputData: any = null;
  @Output() public outputData = new EventEmitter<any>();
  @Output() public feedback = new EventEmitter<string>();
  private invoiceService = inject(InvoicesService);
  private authService = inject(AuthService);
  private accountsService = inject(AccountsService);
  public computedData: any;
  public invoiceData: any;
  public invoiceApproved: boolean = false;
  public now = this.invoiceService.now();
  public faThumbsDown = faThumbsDown;
  public faThumbsUp = faThumbsUp;
  public faDownload = faDownload;

  async ngOnChanges() {
    if (this.inputData) {
      const {
        data: { session },
      } = await this.authService.session();

      const accountArray = await this.accountsService.getAccountById(
        this.inputData.account_id
      );
      const accountData = accountArray[0];

      this.computedData = this.calculateInvoiceData(this.inputData);
      this.invoiceData = {
        ...this.inputData,
        ...this.computedData,
        user: session?.user?.user_metadata,
        account: accountData,
      };
    }
  }

  public setInputData(data: any) {
    this.inputData = data;
  }

  calculateInvoiceData(inputData: any) {
    const subtotal = inputData.days * inputData.rate;
    const iva = subtotal * (inputData.iva_percent / 100);
    const irpf_amount = subtotal * (inputData.irpf_percent / 100);
    const iva_amount = subtotal * (inputData.iva_percent / 100);
    const subtotal_with_iva = subtotal + iva;
    const total = subtotal_with_iva - irpf_amount;
    return {
      subtotal,
      subtotal_with_iva,
      irpf_amount,
      iva_amount,
      total,
    };
  }

  discardInvoice() {
    this.outputData.emit({ feedback: 'discard' });
  }

  closeInvoice() {
    this.outputData.emit({ feedback: 'close' });
  }

  approveInvoice() {
    this.outputData.emit({ feedback: 'approve', data: this.invoiceData });
  }

  generatePDF() {
    const elementToPrint = document.getElementById('contentToConvert');

    html2canvas(elementToPrint!, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      const fileName = `factura_${this.invoiceData?.invoice_number}_${this.invoiceData?.account?.alias}.pdf`;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(fileName);
    });
  }
}
