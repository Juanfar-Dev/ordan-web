import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faEye } from '@fortawesome/free-solid-svg-icons';
import { AccountsService } from '../accounts.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-accounts',
  imports: [FontAwesomeModule, CommonModule, NgOptimizedImage],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent {
  faPlus = faPlus;
  faEye = faEye;
  public accountsService = inject(AccountsService);
  public accounts: any[] = [];
  public loading = false;
  public accounts$ = this.accountsService.getAccounts();

  // El método getAccounts ya no es necesario si usas el async pipe
}
