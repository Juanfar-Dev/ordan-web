import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signin',
  imports: [ReactiveFormsModule, NgOptimizedImage, RouterModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export default class SigninComponent {
  public signinForm!: FormGroup;
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  public showConfirmPassword = false;
  public isLoading = false;

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.signinForm = this.fb.group({
      email: [
        null,
        {
          updateOn: 'change',
          validators: [Validators.required, Validators.email],
        },
      ],
      password: [
        null,
        {
          updateOn: 'change',
          validators: [Validators.required, Validators.minLength(6)],
        },
      ],
    });
  }

  async signin() {
    this.isLoading = true;
    this.signinForm.markAllAsTouched();

    if (this.signinForm.valid) {
      const formData = this.signinForm.value;

      try {
        const response = await this.authService.signin(formData);

        if (response.error) {
          console.error('Error signing in user:', response.error.message);
          this.signinForm.reset();
          this.isLoading = false;
          return;
        }

        console.log('User signed in successfully:', response);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('session', JSON.stringify(response.data.session));
        this.router.navigate(['/']);
        this.signinForm.reset();
        this.isLoading = false;

      } catch (error) {
        console.error('Error signing in user:', error);
        this.signinForm.reset();
        this.isLoading = false;
      }

    } else {
      console.error('Form is invalid');
      this.isLoading = false;
    }
  }
}
