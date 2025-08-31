import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../../shared/services/notification/notification.service';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, NgOptimizedImage, CommonModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export default class SignupComponent {
  public signupForm!: FormGroup;
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  public showConfirmPassword = false;
  public isLoading = false;

  ngOnInit() {
    this.initForm();
    this.formEvents();
  }

  formEvents() {
    this.signupForm.controls['password'].valueChanges.subscribe((values) => {
      if (this.signupForm.controls['password'].valid) {
        this.showConfirmPassword = true;
      } else {
        this.signupForm.controls['confirmPassword'].setValue(null);
        this.showConfirmPassword = false;
      }
      this.signupForm.updateValueAndValidity();
    });
  }

  initForm() {
    this.signupForm = this.fb.group({
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

  async onSignUp() {
    this.isLoading = true;
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      this.isLoading = false;
      return;
    }

    const userData = {
      name: this.signupForm.get('name')?.value,
      surname: this.signupForm.get('surname')?.value,
      email: this.signupForm.get('email')?.value,
      address: this.signupForm.get('address')?.value,
      phone: this.signupForm.get('phone')?.value,
      nif: this.signupForm.get('nif')?.value,
    };

    const credentials = {
      email: this.signupForm.get('email')?.value,
      password: this.signupForm.get('password')?.value,
    };

    try {
      const response = await this.authService.signup(credentials, userData);

      if (response.error) {
        console.error('Error signing up user:', response.error.message);
        this.signupForm.reset();
        this.isLoading = false;
        this.notificationService.updateNotification(`<strong>Error al registrarse:</strong> ${response.error.message}`,'error', 15000);
        return;
      }

      console.log('User signed up successfully:', response);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('session',JSON.stringify(response.data.session));
      this.router.navigate(['/']);
      this.signupForm.reset();
      this.isLoading = false;
    } catch (error) {
      console.error('Error during signup:', error);
      this.signupForm.reset();
      this.isLoading = false;
    }
  }
}
