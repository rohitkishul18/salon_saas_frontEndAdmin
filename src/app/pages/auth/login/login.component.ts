import { Component } from '@angular/core';
import { Router } from '@angular/router';
// import Swal from 'sweetalert2';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

 login() {
    if (!this.email || !this.password) {
      alert('Please fill in all required fields');
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.user.role);

        alert('Login successful');

        // Role-based navigation
        if (res.data.user.role === 'superadmin') {
          this.router.navigate(['/superadmin/dashboard']);
        } else if (res.data.user.role === 'salon-owner')  {
          this.router.navigate(['/salon-owner/dashboard']);
        } else {
          this.router.navigate(['/login']); // fallback
        }
      },
      error: (err) => {
        alert(err.error.message);
      }
    });
  }
}