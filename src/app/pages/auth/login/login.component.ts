import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  showPassword: boolean = false;
  isLoading: boolean = false;
  
  // Notification properties
  showNotification: boolean = false;
  notificationType: 'success' | 'error' = 'success';
  notificationMessage: string = '';

  private timeoutId: any;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Optional: Subscribe to form changes to clear global errors on input
    this.loginForm.valueChanges.subscribe(() => {
      this.notificationMessage = ''; // Clear any global error on change
    });
  }

  onInput(fieldName: string): void {
    const control = this.loginForm.get(fieldName);
    if (control) {
      control.markAsTouched();
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  showNotificationModal(type: 'success' | 'error', message: string) {
    this.notificationType = type;
    this.notificationMessage = message;
    this.showNotification = true;

    // Clear previous timeout
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Auto-hide after 4 seconds for success, 5 seconds for error
    this.timeoutId = setTimeout(() => {
      this.hideNotification();
    }, type === 'success' ? 4000 : 5000);
  }

  hideNotification() {
    this.showNotification = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  login() {
    // Mark all fields as touched for validation display
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });

    // Validate form
    if (this.loginForm.invalid) {
      this.showNotificationModal('error', 'Please fill in all required fields correctly');
      return;
    }

    this.isLoading = true;

    const formValue = this.loginForm.value;
    this.authService.login(formValue.email.trim(), formValue.password).subscribe({
      next: (res: any) => {
        try {
          // Store token and role
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('role', res.data.user.role);
          localStorage.setItem('salonId', res.data.user.salonId);

          // Store complete user details
          localStorage.setItem('user', JSON.stringify(res.data.user));

          // If salon-owner, store salon-specific details
          if (res.data.user.role === 'salon-owner' && res.data.user.salonDetails) {
            localStorage.setItem('salonDetails', JSON.stringify(res.data.user.salonDetails));
          }

          // Store any additional data from response
          if (res.data.permissions) {
            localStorage.setItem('permissions', JSON.stringify(res.data.permissions));
          }

          this.showNotificationModal('success', 'Login successful! Redirecting...');

          // Role-based navigation with delay for notification
          setTimeout(() => {
            this.isLoading = false;
            if (res.data.user.role === 'superadmin') {
              this.router.navigate(['/superadmin/dashboard']);
            } else if (res.data.user.role === 'salon-owner') {
              this.router.navigate(['/salon-owner/dashboard']);
            } else {
              this.router.navigate(['/dashboard']); // fallback
            }
          }, 1500);

        } catch (error) {
          this.isLoading = false;
          this.showNotificationModal('error', 'An error occurred while processing login data');
          console.error('Login data processing error:', error);
        }
      },
      error: (err) => {
        this.isLoading = false;
        
        // Handle different error scenarios
        let errorMessage = 'Login failed. Please try again.';
        
        if (err.status === 0) {
          errorMessage = 'Unable to connect to server. Please check your internet connection.';
        } else if (err.status === 401) {
          errorMessage = 'Invalid email or password. Please try again.';
        } else if (err.status === 403) {
          errorMessage = 'Access denied. Your account may be inactive or suspended by superadmin.';
        } else if (err.status === 404) {
          errorMessage = 'User not found. Please check your credentials.';
        } else if (err.status === 429) {
          errorMessage = 'Too many login attempts. Please try again later.';
        } else if (err.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (err.error && err.error.message) {
          errorMessage = err.error.message;
        }

        this.showNotificationModal('error', errorMessage);
        console.error('Login error:', err);
      }
    });
  }

  ngOnDestroy() {
    // Clear any pending timeouts when component is destroyed
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.hideNotification();
  }
}