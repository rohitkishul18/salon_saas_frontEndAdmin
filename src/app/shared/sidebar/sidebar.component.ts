import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Input() role: 'superadmin' | 'salon-owner' = 'salon-owner';
  @Input() userName: string = 'User';
  @Input() showUserInfo: boolean = true;
  @Input() isOpen: boolean = true; // Default true to match original; parent can control for mobile

  menuItems: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.setupMenu();
  }

  setupMenu() {
    // Use switch for clarity and extensibility
    switch (this.role) {
      case 'superadmin':
        this.menuItems = [
          { label: 'Dashboard', icon: '📊', route: '/superadmin/dashboard' },
          { label: 'Salons', icon: '🏢', route: '/superadmin/salons' },
        ];
        break;
      case 'salon-owner':
      default:
        this.menuItems = [
          { label: 'Dashboard', icon: '📊', route: '/salon-owner/dashboard' },
          { label: 'Branches', icon: '📍', route: '/salon-owner/locations' },
          { label: 'Bookings', icon: '📅', route: '/salon-owner/booking' },
          { label: 'Services', icon: '💇‍♂️', route: '/salon-owner/services' },
          { label: 'Customers', icon: '👥', route: '/salon-owner/user' } ,
        ];
        break;
    }
  }

  trackByFn(index: number, item: any): string {
    return item.route;
  }

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    // Auto-close sidebar on mobile after navigation
    if (window.innerWidth <= 768) {
      this.closeSidebar();
    }
  }

  closeSidebar() {
    this.isOpen = false;
    document.body.classList.remove('sidebar-open');
  }

  getUserInitials(): string {
    return this.userName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}