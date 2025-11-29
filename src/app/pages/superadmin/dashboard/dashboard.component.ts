import { Component, OnInit } from '@angular/core';
import { SuperadminService } from '../../../core/services/superadmin.service';

@Component({
  selector: 'app-dashboard-superadmin',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponentSuperAdmin implements OnInit {

  loading = true;

  totalSalons = 0;
  totalOwners = 0;
  totalBookings = 0;

  recentSalons: any[] = [];

  constructor(private dashboardService: SuperadminService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;

    this.dashboardService.getDashboardStats().subscribe({
      next: (res: any) => {
        const data = res.data;

        this.totalSalons = data?.salon?.total || 0;
        this.totalOwners = data?.recentSalons.length || 0;
        this.totalBookings = data?.bookings?.total || 0;
        this.recentSalons = data?.recentSalons || [];
        
        this.loading = false;
      },

      error: (err) => {
        this.loading = false;
        console.error('Dashboard error:', err);
        alert('Failed to load dashboard');
      }
    });
  }

  getSalonInitial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '?';
  }


  // formatNumber(num: number): string {
  //   if (num >= 1000000) {
  //     return (num / 1000000).toFixed(1) + 'M';
  //   }
  //   if (num >= 1000) {
  //     return (num / 1000).toFixed(1) + 'K';
  //   }
  //   return num.toString();
  // }

}