import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface UserData {
  email: string;
  id: string;
  isActive: boolean;
  name: string;
  role: string;
  salonId: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  userName: string = '';
  userRole: string = '';
  userEmail: string = '';
  isLoading: boolean = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    try {
      // Get user data from localStorage
      const userDataString = localStorage.getItem('user');
      const role = localStorage.getItem('role');
      
      if (userDataString) {
        const userData: UserData = JSON.parse(userDataString);
        this.userName = userData.name || 'User';
        this.userRole = userData.role || role || 'guest';
        this.userEmail = userData.email || '';
      } else {
        // Fallback to individual items
        this.userName = localStorage.getItem('userName') || 'User';
        this.userRole = role || 'guest';
        this.userEmail = localStorage.getItem('userEmail') || '';
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      this.userName = 'User';
      this.userRole = 'guest';
    } finally {
      this.isLoading = false;
    }
  }

  getRoleDisplayName(): string {
    const roleMap: { [key: string]: string } = {
      'salon-owner': 'Salon Owner',
      'admin': 'Administrator',
      'staff': 'Staff Member',
      'manager': 'Manager',
      'receptionist': 'Receptionist',
      'stylist': 'Stylist'
    };
    return roleMap[this.userRole] || this.formatRole(this.userRole);
  }

  private formatRole(role: string): string {
    return role
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  logout(): void {
    // Clear all user-related data
    const keysToRemove = ['token', 'role', 'userData', 'userName', 'userEmail', 'salonId'];
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Navigate to login
    this.router.navigate(['/login']);
  }
}