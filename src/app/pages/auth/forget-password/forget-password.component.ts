import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  forgotForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showSuccess = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Initialize reactive form
    this.forgotForm = this.fb.group({
      email: ['', [
        Validators.required, 
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]]
    });
  }

  sendResetLink(): void {
    // Clear previous messages
    this.errorMessage = '';
    this.successMessage = '';

    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      
      // Set custom error message
      const emailControl = this.forgotForm.get('email');
      if (emailControl?.hasError('required')) {
        this.errorMessage = 'Please enter your email address.';
      } else if (emailControl?.hasError('email') || emailControl?.hasError('pattern')) {
        this.errorMessage = 'Please enter a valid email address (e.g., user@example.com).';
      }
      
      return;
    }

    this.isLoading = true;
    const { email } = this.forgotForm.value;

    // Call API
    this.authService.forgotPassword({ email }).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.successMessage = response.message || 
          'Reset link sent successfully! Please check your email inbox (and spam folder).';
        this.showSuccess = true;
        
        // Disable form after successful submission
        this.forgotForm.disable();
      },
      error: (err: any) => {
        this.isLoading = false;
        
        // Handle different error scenarios
        if (err.status === 404) {
          this.errorMessage = 'Email address not found. Please check and try again.';
        } else if (err.status === 429) {
          this.errorMessage = 'Too many requests. Please try again later.';
        } else if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Something went wrong. Please try again later.';
        }
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Helper getter for template
  get email() {
    return this.forgotForm.get('email');
  }

  getEmailError(): string {
    if (this.email?.touched) {
      if (this.email.hasError('required')) {
        return 'Email is required';
      }
      if (this.email.hasError('email') || this.email.hasError('pattern')) {
        return 'Please enter a valid email address';
      }
    }
    return '';
  }
}