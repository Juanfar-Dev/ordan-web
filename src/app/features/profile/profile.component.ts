import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NotificationService } from '../../shared/services/notification/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../shared/services/utils/utils.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  public profileForm!: FormGroup;
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private utilsService = inject(UtilsService);
  public profilePreview: any;
  public matchedData: boolean = false;
  public showConfirmPassword = false;
  public isLoading = false;

  async ngOnInit() {
    this.initForm();
    await this.patchForm();
    this.matchedData = this.utilsService.areObjectsEqual(
      this.profileForm.value,
      this.profilePreview
    );
    this.formEvents();
  }

  private async getSession() {
    const {
      data: { session },
    } = await this.authService.session();
    return session?.user.user_metadata;
  }

  initForm() {
    this.profileForm = this.fb.group({
      name: [
        null,
        {
          updateOn: 'change',
          validators: [Validators.required],
        },
      ],
      surname: [
        null,
        {
          updateOn: 'change',
          validators: [Validators.required],
        },
      ],
      email: [
        null,
        {
          updateOn: 'change',
          validators: [Validators.required, Validators.email],
        },
      ],
      address: [
        null,
        {
          updateOn: 'change',
          validators: [Validators.required],
        },
      ],
      phone: [
        null,
        {
          updateOn: 'change',
          validators: [Validators.required, Validators.pattern('^\\d{9}$')],
        },
      ],
      nif: [
        null,
        {
          updateOn: 'change',
          validators: [
            Validators.required,
            Validators.pattern('^[A-Z0-9]{9}$'),
          ],
        },
      ],
      password: [
        null,
        {
          updateOn: 'change',
          validators: [Validators.required, Validators.minLength(6)],
        },
      ],
      confirmPassword: [
        null,
        {
          updateOn: 'change',
          validators: [Validators.required, Validators.minLength(6)],
        },
      ],
    });
  }

  async patchForm() {
    const userData = await this.getSession();
    this.profileForm.patchValue({
      name: userData?.['name'] || '',
      surname: userData?.['surname'] || '',
      email: userData?.['email'] || '',
      address: userData?.['address'] || '',
      phone: userData?.['phone'] || '',
      nif: userData?.['nif'] || '',
    });
    this.profilePreview = { ...this.profileForm.value };
  }

  formEvents() {
    this.profileForm.valueChanges.subscribe((value) => {
      this.matchedData = this.utilsService.areObjectsEqual(
        this.profileForm.value,
        this.profilePreview
      );
    });
  }

  async onUpdateProfile() {
    this.isLoading = true;
    try {
      await this.authService.updateProfile(this.profileForm.value);
      this.profilePreview = { ...this.profileForm.value };
      this.matchedData = true;
      this.notificationService.updateNotification(
        'Perfil actualizado con éxito',
        'success'
      );
    } catch (error) {
      this.router.navigate(['/'], { relativeTo: this.route });
      this.notificationService.updateNotification(
        'Error al actualizar el perfil',
        'error'
      );
    } finally {
      this.isLoading = false;
    }
  }
}
