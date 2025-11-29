// Updated register.component.ts with Reactive Forms
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';
  showTermsModal: boolean = false;
  showPassword: boolean = false; 

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      salonName: ['', [Validators.required, Validators.minLength(3)]],
      ownerName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, this.phoneValidator()]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)]],
      terms: [false, [Validators.requiredTrue]]
    });
  }

  ngOnInit(): void {
    // Optional: Subscribe to form changes for real-time validation if needed
    this.registerForm.valueChanges.subscribe(() => {
      this.errorMessage = ''; // Clear global error on any change
    });
  }

  // Custom validator for phone
  private phoneValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value || control.value.trim().length === 0) {
        return { required: true };
      }
      const phoneDigits = control.value.replace(/\D/g, '');
      if (phoneDigits.length !== 10) {
        return { phoneDigits: true };
      }
      if (!/^\d{10}$/.test(phoneDigits)) {
        return { phonePattern: true };
      }
      return null;
    };
  }

  onInput(fieldName: string): void {
    const control = this.registerForm.get(fieldName);
    if (control) {
      control.markAsTouched();
    }
    this.errorMessage = ''; // Clear global error on input
  }

  onTermsChange(): void {
    const termsControl = this.registerForm.get('terms');
    if (termsControl) {
      termsControl.markAsTouched();
    }
    this.errorMessage = ''; // Clear global error on change
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  openTermsModal(): void {
    this.showTermsModal = true;
  }

  closeTermsModal(): void {
    this.showTermsModal = false;
  }

  private storeUserData(responseData: any): void {
    try {
      if (responseData.token) {
        localStorage.setItem('token', responseData.token);
      }

      if (responseData.user?.role) {
        localStorage.setItem('role', responseData.user.role);
      }

      if (responseData.user?.salonId) {
        localStorage.setItem('salonId', responseData.user.salonId);
      } else {
        localStorage.setItem('salonId', '');
      }

      if (responseData.user) {
        localStorage.setItem('user', JSON.stringify(responseData.user));
      }
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  }

  private navigateBasedOnRole(role: string): void {
    switch (role) {
      case 'superadmin':
        this.router.navigate(['/superadmin/dashboard']);
        break;
      case 'salon-owner':
        this.router.navigate(['/salon-owner/dashboard']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }

  register(): void {
    // Mark all fields as touched for validation display
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.markAsTouched();
    });

    // Validate form
    if (this.registerForm.invalid) {
      this.errorMessage = this.registerForm.get('terms')?.invalid ? 'Please accept the terms and conditions' : '';
      return;
    }

    // Set loading state
    this.isLoading = true;
    this.errorMessage = '';

    // Prepare payload (trim values manually)
    const formValue = this.registerForm.value;
    const payload = {
      salonName: formValue.salonName.trim(),
      ownerName: formValue.ownerName.trim(),
      email: formValue.email.trim().toLowerCase(),
      phone: formValue.phone.trim(),
      password: formValue.password
    };

    // Call registration API
    this.authService.register(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.data) {
          this.storeUserData(res.data);

          // Navigate based on role
          if (res.data.user?.role) {
            this.navigateBasedOnRole(res.data.user.role);
          } else {
            this.router.navigate(['/login']);
          }
        } else {
          // Registration successful but no data returned
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        this.isLoading = false;

        // Handle different error types
        if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else if (err.error?.error) {
          this.errorMessage = err.error.error;
        } else if (err.status === 0) {
          this.errorMessage = 'Network error. Please check your connection.';
        } else if (err.status === 409) {
          this.errorMessage = 'Email already registered. Please use a different email.';
        } else if (err.status === 400) {
          this.errorMessage = 'Invalid registration data. Please check your inputs.';
        } else if (err.status >= 500) {
          this.errorMessage = 'Server error. Please try again later.';
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }

        // Scroll to top to show error
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}