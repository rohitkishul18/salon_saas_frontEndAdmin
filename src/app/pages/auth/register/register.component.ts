// Updated register.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  // Form fields
  salonName: string = '';
  ownerName: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  termsAccepted: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  fieldErrors: { [key: string]: string } = {};
  showTermsModal: boolean = false;
  showPassword: boolean = false; 

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  openTermsModal(): void {
    this.showTermsModal = true;
  }

  closeTermsModal(): void {
    this.showTermsModal = false;
  }

  private validateForm(): boolean {
    this.fieldErrors = {};
    this.errorMessage = '';
    let isValid = true;

    // Salon Name validation
    if (!this.salonName || this.salonName.trim().length === 0) {
      this.fieldErrors['salonName'] = 'Salon name is required';
      isValid = false;
    } else if (this.salonName.trim().length < 3) {
      this.fieldErrors['salonName'] = 'Salon name must be at least 3 characters';
      isValid = false;
    }

    // Owner Name validation
    if (!this.ownerName || this.ownerName.trim().length === 0) {
      this.fieldErrors['ownerName'] = 'Owner name is required';
      isValid = false;
    } else if (this.ownerName.trim().length < 2) {
      this.fieldErrors['ownerName'] = 'Owner name must be at least 2 characters';
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(this.ownerName.trim())) {
      this.fieldErrors['ownerName'] = 'Owner name should only contain letters';
      isValid = false;
    }

    // Email validation
    if (!this.email || this.email.trim().length === 0) {
      this.fieldErrors['email'] = 'Email is required';
      isValid = false;
    } else if (!this.isValidEmail(this.email)) {
      this.fieldErrors['email'] = 'Please enter a valid email address';
      isValid = false;
    }

    // Phone validation (required)
    if (!this.phone || this.phone.trim().length === 0) {
      this.fieldErrors['phone'] = 'Phone number is required';
      isValid = false;
    } else {
      const phoneDigits = this.phone.replace(/\D/g, '');
      if (phoneDigits.length !== 10) {
        this.fieldErrors['phone'] = 'Phone number must be 10 digits';
        isValid = false;
      } else if (!/^\d{10}$/.test(phoneDigits)) {
        this.fieldErrors['phone'] = 'Phone number must contain only digits';
        isValid = false;
      }
    }

    // Password validation
    if (!this.password || this.password.length === 0) {
      this.fieldErrors['password'] = 'Password is required';
      isValid = false;
    } else if (this.password.length < 8) {
      this.fieldErrors['password'] = 'Password must be at least 8 characters';
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(this.password)) {
      this.fieldErrors['password'] = 'Password must contain uppercase, lowercase, and number';
      isValid = false;
    }

    // Terms acceptance validation
    if (!this.termsAccepted) {
      this.errorMessage = 'Please accept the terms and conditions';
      isValid = false;
    }

    return isValid;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
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

  clearFieldError(fieldName: string): void {
    if (this.fieldErrors[fieldName]) {
      delete this.fieldErrors[fieldName];
    }
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }

  register(): void {
    // Validate form
    if (!this.validateForm()) {
      return;
    }

    // Set loading state
    this.isLoading = true;
    this.errorMessage = '';

    // Prepare payload
    const payload = {
      salonName: this.salonName.trim(),
      ownerName: this.ownerName.trim(),
      email: this.email.trim().toLowerCase(),
      phone: this.phone.trim(),
      password: this.password
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