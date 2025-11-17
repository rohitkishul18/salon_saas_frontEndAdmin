import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Input() role: 'superadmin' | 'salon-owner' = 'salon-owner';

  menuItems: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.setupMenu();
  }

  setupMenu() {
    if (this.role === 'superadmin') {
      this.menuItems = [
        { label: 'Dashboard', icon: '📊', route: '/superadmin/dashboard' },
        { label: 'Salons', icon: '🏢', route: '/superadmin/salons' },
      ];
    }

    if (this.role === 'salon-owner') {
      this.menuItems = [
        { label: 'Dashboard', icon: '📊', route: '/salon-owner/dashboard' },
        { label: 'Locations', icon: '📍', route: '/salon-owner/locations' },
        { label: 'Bookings', icon: '📅', route: '/salon-owner/booking' },
        { label: 'Services', icon: '💇‍♂️', route: '/salon-owner/services' },
        { label: 'Gallery', icon: '🖼️', route: '/salon-owner/gallery' },
      ];
    }
  }

  isActive(route: string) {
    return this.router.url.startsWith(route);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  /** NEW — Close sidebar for mobile */
  closeSidebar() {
    document.body.classList.remove('sidebar-open');
  }
}
