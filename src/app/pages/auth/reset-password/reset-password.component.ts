import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showSuccess = false;
  token: string = '';
  email: string = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Extract token and email from query params
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      this.email = params['email'] || '';
      
      if (!this.token || !this.email) {
        this.errorMessage = 'Invalid reset link. Please request a new one.';
      }
    });

    // Initialize form
    this.resetForm = this.fb.group({
      newPassword: ['', [
        Validators.required, 
        Validators.minLength(6), 
        this.uppercaseValidator()
      ]],
      confirmPassword: ['', [Validators.required]]
    });

    // Add custom validator for confirmPassword after form is created
    this.resetForm.get('confirmPassword')?.setValidators([
      Validators.required,
      this.confirmPasswordValidator()
    ]);

    // Re-validate confirmPassword when newPassword changes
    this.resetForm.get('newPassword')?.valueChanges.subscribe(() => {
      this.resetForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  // Custom validator for uppercase
  uppercaseValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value || control.value.length === 0) return null;
      return /[A-Z]/.test(control.value) ? null : { uppercase: true };
    };
  }

  // Custom validator for password match
  confirmPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) return null;
      const newPassword = this.resetForm?.get('newPassword')?.value;
      return control.value === newPassword ? null : { mismatch: true };
    };
  }

  onSubmit(): void {
    if (this.resetForm.invalid || !this.token || !this.email) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { newPassword } = this.resetForm.value;

    this.authService.resetPassword({ 
      token: this.token, 
      email: this.email, 
      newPassword 
    }).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.successMessage = response.message || 'Password reset successful! You can now log in.';
        this.showSuccess = true;
        this.resetForm.disable();
        // Auto-redirect to login after 3 seconds
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Reset failed. Token may be invalid or expired.';
      }
    });
  }

  backToLogin(): void {
    this.router.navigate(['/login']);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  get newPassword() {
    return this.resetForm.get('newPassword');
  }

  get confirmPassword() {
    return this.resetForm.get('confirmPassword');
  }

  getPasswordError(): string {
    if (this.newPassword?.touched) {
      if (this.newPassword.hasError('required')) return 'New password is required';
      if (this.newPassword.hasError('minlength')) return 'Password must be at least 6 characters';
      if (this.newPassword.hasError('uppercase')) return 'Password must contain at least one uppercase letter';
    }
    return '';
  }

  getConfirmError(): string {
    if (this.confirmPassword?.touched) {
      if (this.confirmPassword.hasError('required')) return 'Please confirm your password';
      if (this.confirmPassword.hasError('mismatch')) return 'Passwords do not match';
    }
    return '';
  }
}