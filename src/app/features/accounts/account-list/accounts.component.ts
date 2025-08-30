import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faEye, faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons';
import { AccountsService } from '../accounts.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DefaultAvatarComponent } from '../../../shared/components/default-avatar/default-avatar.component';

@Component({
  selector: 'app-accounts',
  imports: [FontAwesomeModule, CommonModule, NgOptimizedImage, DefaultAvatarComponent],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent {
  public route = inject(ActivatedRoute);
  public router = inject(Router);
  public accountsService = inject(AccountsService);
  public accounts: any[] = [];
  faPlus = faPlus;
  faEye = faEye;
  faFileInvoiceDollar = faFileInvoiceDollar;
  // public accounts$ = this.accountsService.getMockAccounts();
  public isLoading = false;
  public accounts$ = this.accountsService.getAccounts();

  onCreateAccount() {
    this.router.navigate(['new-accounts'], { relativeTo: this.route });
  }

  onViewAccountDetails(account_id_short: string) {
    this.router.navigate(['accounts', account_id_short], { relativeTo: this.route });
  }

  onViewAccountInvoices(account_id: string) {
    this.router.navigate(['home', 'invoices'], { queryParams: { account_id } });
  }
}
