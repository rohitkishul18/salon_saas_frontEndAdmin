import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  // Bind all form fields
  salonName: string = '';
  ownerName: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  termsAccepted: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

   register() {
    if (!this.termsAccepted) {
     alert('Please accept the terms and conditions');
      return;
    }

    if (!this.salonName || !this.ownerName || !this.email || !this.password) {
      alert('Please fill in all required fields');
      return;
    }

    const payload = {
      salonName: this.salonName,
      ownerName: this.ownerName,
      email: this.email,
      phone: this.phone,
      password: this.password
    };

    this.authService.register(payload).subscribe({
      next: (res: any) => {
        // Save token & role if backend returns immediately
        if (res.data.token && res.data.user?.role) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('role', res.data.user.role);

         alert('Registration successful');

          // Role-based navigation
          if(res.data.user.role === 'superadmin') {
            this.router.navigate(['/superadmin/dashboard']);
          } else if(res.data.user.role === 'salon-owner') {
            this.router.navigate(['/salon-owner/dashboard']);
          } else {
            this.router.navigate(['/login']); // fallback
          }
        } else {
          // If backend does not return token, redirect to login
          alert('Registration successful');
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        alert(err.error.message);
      }
    });
  }

}
