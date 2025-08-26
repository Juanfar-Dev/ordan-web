import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faEye } from '@fortawesome/free-solid-svg-icons';
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
  public loading = false;
  faPlus = faPlus;
  faEye = faEye;
  // public accounts$ = this.accountsService.getMockAccounts();
  public accounts$ = this.accountsService.getAccounts();

  onCreateAccount() {
    this.router.navigate(['new-accounts'], { relativeTo: this.route });
  }
}
