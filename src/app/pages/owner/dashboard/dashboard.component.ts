import { Component, OnInit } from '@angular/core';
import { SalonService } from '../../../core/services/salon.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  loading = true;

  stats: any = {
    todayBookings: 0,
    upcoming: 0,
    services: 0,
    locations: 0
  };

  nextAppointment: any = null;

  recentBookings: any[] = [];

  status: any = {
    info: false,
    services: false,
    gallery: false,
    locations: false
  };

  constructor(private salonService: SalonService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard() {
    this.salonService.getDashboard().subscribe({
      next: (res: any) => {
        this.stats = res.stats;
        this.nextAppointment = res.nextAppointment;
        this.recentBookings = res.recentBookings;
        this.status = res.status;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        // Swal.fire('Error', 'Failed to load dashboard', 'error');
        alert('Failed to load dashboard');
      }
    });
  }
}
