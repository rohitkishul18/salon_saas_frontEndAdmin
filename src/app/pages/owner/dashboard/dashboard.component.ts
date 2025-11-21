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
    locations: false
  };

  constructor(private salonService: SalonService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard() {
    this.loading = true;
    this.salonService.getDashboard().subscribe({
      next: (res: any) => {
        console.log(res);
        this.stats = res.stats || this.stats;
        this.nextAppointment = res.nextAppointment || null;
        this.recentBookings = res.recentBookings || [];
        this.status = res.status || this.status;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        alert('Failed to load dashboard');
      }
    });
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

}