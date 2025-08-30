import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AccountsService } from '../accounts.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NewAccount } from '../account';

@Component({
  selector: 'app-account-form',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './account-form.component.html',
  styleUrl: './account-form.component.css',
})
export class AccountFormComponent {
  public route = inject(ActivatedRoute);
  public accountForm!: FormGroup;
  private accountService = inject(AccountsService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  public selectedFile: File | null = null;
  public accountLiterals: { subtitle: string; buttonLabel: string } = {
    subtitle: 'Ingresa los datos principales de la cuenta',
    buttonLabel: 'Crear cuenta',
  };
  public accountPreview!: NewAccount;
  public matchedData: boolean = false;
  public isLoading = false;

  async ngOnInit() {
    this.initForm();
    if (this.route.snapshot.paramMap.get('id')) {
      await this.getAccountByIdShort(this.route.snapshot.paramMap.get('id')!);
      this.matchedData = this.areObjectsEqual(
        this.accountForm.value,
        this.accountPreview
      );
    }
    this.formEvents();
  }

  initForm() {
    this.accountForm = this.fb.group({
      name: ['', Validators.required],
      alias: ['', Validators.required],
      cif: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      job_role: ['', Validators.required],
      avatarFile: [null],
    });
  }

  formEvents() {
    this.accountForm.valueChanges.subscribe((value) => {
      this.matchedData = this.areObjectsEqual(
        this.accountForm.value,
        this.accountPreview
      );
    });
  }

  async getAccountByIdShort(account_id_short: string): Promise<void> {
    try {
      this.accountPreview = await this.accountService.getAccountByIdShort(
        account_id_short
      );
      this.accountForm.patchValue(this.accountPreview);
      this.accountPreview = { ...this.accountForm.value };
      this.accountLiterals = {
        subtitle: 'Revisa los datos de la cuenta',
        buttonLabel: 'Actualizar cuenta',
      };
    } catch (error) {
      console.error('Error fetching account:', error);
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  async onCreateAccount() {
    this.isLoading = true;
    this.accountForm.markAllAsTouched();

    if (this.accountForm.valid) {
      const accountData = this.accountForm.value;

      try {
        const response = await this.accountService.createAccount(accountData, this.selectedFile);
        console.log('Account created successfully:', response);
        this.accountForm.reset();
        this.selectedFile = null;
        this.router.navigate(['/home/accounts'], {
          relativeTo: this.router.routerState.root.firstChild,
        });
        this.isLoading = false;
      } catch (error) {
        console.error('Error creating account:', error);
        this.isLoading = false;
      }
    } else {
      console.error('Form is invalid');
      this.isLoading = false;
    }
  }

  onDiscard() {
    this.accountForm.reset();
    this.selectedFile = null;
    this.router.navigate(['/home/accounts'], {
      relativeTo: this.router.routerState.root.firstChild,
    });
  }

  private areObjectsEqual = (obj1: NewAccount, obj2: NewAccount) => {
    // The key order must be consistent for this to work correctly.
    const json1 = JSON.stringify(obj1);
    const json2 = JSON.stringify(obj2);
    return json1 === json2;
  };
}
