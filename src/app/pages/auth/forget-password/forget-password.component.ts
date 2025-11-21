import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent {

  email: string = '';
  successMessage: string = '';

  constructor(private router: Router) {}

  sendResetLink() {
    if (!this.email) {
      alert('Please enter your email address');
      return;
    }
    
    this.successMessage = 'We have sent a password reset link to your email address. Please check your inbox (and spam folder) for the link.';
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

}