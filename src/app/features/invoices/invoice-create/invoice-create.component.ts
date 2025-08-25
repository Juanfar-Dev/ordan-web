import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { InvoicesService } from '../invoices.service';
import { Router, RouterModule } from '@angular/router';
import { AccountsService } from '../../accounts/accounts.service';
import { CommonModule, NgForOf } from '@angular/common';
import { InvoiceTemplateComponent } from '../invoice-template/invoice-template.component';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-regular-svg-icons';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Invoice } from '../invoice';


@Component({
  selector: 'app-invoice-create',
  imports: [ReactiveFormsModule, RouterModule, NgForOf, InvoiceTemplateComponent, FontAwesomeModule, CommonModule],
  templateUrl: './invoice-create.component.html',
  styleUrl: './invoice-create.component.css',
})
export class InvoiceCreateComponent {
  public invoiceForm!: FormGroup;
  private invoiceService = inject(InvoicesService);
  private accountsService = inject(AccountsService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  public now = this.invoiceService.now();
  public faMagnifyingGlass = faMagnifyingGlass;
  public faThumbsUp = faThumbsUp;
  public faThumbsDown = faThumbsDown;
  public accounts: any[] = [];
  public invoiceApproved: boolean = false;
  public invoiceButton = { icon: faThumbsDown, label: 'Factura no aprobada' };
  public invoiceSend: Invoice | null = null;

  @ViewChild('invoice_modal') invoiceModal!: ElementRef;


  ngOnInit() {
    this.initForm();
    this.getAccountByUserId();
  }

  initForm() {
    this.invoiceForm = this.fb.group({
      account_id: [
        null,
        {
          updateOn: 'change',
          validators: [Validators.required],
        },
      ],
      submited_at: [
        `${this.now.year}-${this.now.month}-${this.now.day}`,
        {
          updateOn: 'change',
          validators: [Validators.required],
        },
      ],
      invoice_number: [
        null,
        {
          updateOn: 'change',
          validators: [Validators.required],
        },
      ],
      rate: [
        null,
        {
          updateOn: 'change',
          validators: [Validators.required],
        },
      ],
      days: [
        null,
        {
          updateOn: 'change',
          validators: [Validators.required],
        },
      ],
      iva_percent: [
        null,
        {
          updateOn: 'change',
          validators: [Validators.required],
        },
      ],
      irpf_percent: [
        null,
        {
          updateOn: 'change',
          validators: [Validators.required],
        },
      ],
    });
  }

  getAccountByUserId() {
    this.accountsService.getAccountByUserId().then((accounts) => {
      if (accounts) {
        this.accounts = accounts;
      }
    });
  }

  onOutputData(event: { feedback: string; data?: any }) {
    if (event.feedback === 'approve') {
      this.invoiceApproved = true;
      this.invoiceButton = { icon: faThumbsUp, label: 'Factura aprobada' };
      const user_id = event.data.user.sub;
      const account_alias = event.data.account.alias;
      const invoicePreData = { ...event.data, user_id, account_alias };
      const { user, account, ...invoiceSendData } = invoicePreData;
      this.invoiceSend = invoiceSendData;
    } else if (event.feedback === 'discard') {
      this.invoiceApproved = false;
      this.invoiceButton = { icon: faThumbsDown, label: 'Factura no aprobada' };
      this.invoiceSend = null;
    }
    this.invoiceModal.nativeElement.close();
  }

  async onCreateInvoice() {
    this.invoiceForm.markAllAsTouched();
    if (this.invoiceForm.valid) {
      const invoiceData = this.invoiceSend;
      try {
        const response = await this.invoiceService.createInvoice(invoiceData);
        console.log('Invoice created successfully:', response);
        this.invoiceForm.reset();
        this.router.navigate(['/home/invoices'], {
          relativeTo: this.router.routerState.root.firstChild,
        });
      } catch (error) {
        console.error('Error creating invoice:', error);
      }
    } else {
      console.error('Form is invalid');
    }
  }

  onDiscard() {
    this.invoiceForm.reset();
    this.router.navigate(['/home/invoices'], {
      relativeTo: this.router.routerState.root.firstChild,
    });
  }
}
