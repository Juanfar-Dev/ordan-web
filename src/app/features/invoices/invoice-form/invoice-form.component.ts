import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { InvoicesService } from '../invoices.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AccountsService } from '../../accounts/accounts.service';
import { CommonModule, NgForOf } from '@angular/common';
import { InvoiceTemplateComponent } from '../invoice-template/invoice-template.component';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp, faThumbsDown, faEye } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Invoice, NewInvoice } from '../invoice';

@Component({
  selector: 'app-invoice-form',
  imports: [
    ReactiveFormsModule,
    RouterModule,
    NgForOf,
    InvoiceTemplateComponent,
    FontAwesomeModule,
    CommonModule,
  ],
  templateUrl: './invoice-form.component.html',
  styleUrl: './invoice-form.component.css',
})
export class InvoiceFormComponent {
  public route = inject(ActivatedRoute);
  public invoiceForm!: FormGroup;
  private invoiceService = inject(InvoicesService);
  private accountsService = inject(AccountsService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  public now = this.invoiceService.now();
  public faMagnifyingGlass = faMagnifyingGlass;
  public faThumbsUp = faThumbsUp;
  public faThumbsDown = faThumbsDown;
  public faEye = faEye;
  public accounts: any[] = [];
  public invoiceApproved: boolean = false;
  public invoiceButton = { icon: faThumbsDown, label: 'Factura no aprobada' };
  public invoiceSend: Invoice | null = null;
  public invoicePreview!: NewInvoice;
  public invoiceLiterals: { subtitle: string; buttonLabel: string } = {
    subtitle: 'Ingresa los datos principales de la factura',
    buttonLabel: 'Crear factura',
  };
  public matchedData: boolean = false;

  @ViewChild('invoice_modal') invoiceModal!: ElementRef;

  async ngOnInit() {
    this.initForm();
    if (this.route.snapshot.paramMap.get('id')) {
      await this.getInvoiceByIdShort(this.route.snapshot.paramMap.get('id')!);
      this.matchedData = this.areObjectsEqual(this.invoiceForm.value, this.invoicePreview);
      if (this.matchedData) {
        this.invoiceButton = { icon: faEye, label: 'Ver factura' };
      } else {
        this.invoiceButton = { icon: faThumbsDown, label: 'Factura no aprobada' };
      }
    }
    this.formEvents();
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

  formEvents() {
    this.invoiceForm.valueChanges.subscribe((value) => {
      this.matchedData = this.areObjectsEqual(this.invoiceForm.value, this.invoicePreview);
      if (this.matchedData) {
        this.invoiceButton = { icon: faEye, label: 'Ver factura' };
      } else {
        this.invoiceButton = { icon: faThumbsDown, label: 'Factura no aprobada' };
      }
    });
  }

  async getInvoiceByIdShort(invoice_id_short: string) {
    try {
      const invoicePreview = await this.invoiceService.getInvoiceByIdShort(
        invoice_id_short
      );
      if (invoicePreview) {
        this.invoiceForm.patchValue(invoicePreview);
        this.invoicePreview = { ...this.invoiceForm.value };
        this.invoiceLiterals = {
          subtitle: 'Revisa los datos de la factura',
          buttonLabel: 'Actualizar factura',
        };
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
    }
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

  private areObjectsEqual = (obj1: NewInvoice, obj2: NewInvoice) => {
    // The key order must be consistent for this to work correctly.
    const json1 = JSON.stringify(obj1);
    const json2 = JSON.stringify(obj2);

    return json1 === json2;
  };
}
