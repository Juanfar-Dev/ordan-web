import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AccountsService } from '../accounts.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-account-create',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './account-create.component.html',
  styleUrl: './account-create.component.css',
})
export class AccountCreateComponent {
  public accountForm!: FormGroup;
  private accountService = inject(AccountsService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  public selectedFile: File | null = null;

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.accountForm = this.fb.group({
      name: ['', Validators.required],
      alias: ['', Validators.required],
      cif: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      role: ['', Validators.required],
      avatarFile: [null],
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onCreateAccount() {
    this.accountForm.markAllAsTouched();
    if (this.accountForm.valid) {
      const accountData = this.accountForm.value;
      this.accountService
        .createAccount(accountData, this.selectedFile)
        .then((response: any) => {
          console.log('Account created successfully:', response);
          this.accountForm.reset();
          this.selectedFile = null;
          this.router.navigate(['/home/accounts'], {
            relativeTo: this.router.routerState.root.firstChild,
          });
        });
    } else {
      console.error('Form is invalid');
    }
  }

  onDiscard() {
    this.accountForm.reset();
    this.selectedFile = null;
    this.router.navigate(['/home/accounts'], {
      relativeTo: this.router.routerState.root.firstChild,
    });
  }
}
