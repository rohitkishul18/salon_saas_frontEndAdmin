import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-superadmin',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponentSuperAdmin implements OnInit {
  
  totalSalons = 12;       // Dummy data
  totalOwners = 8;        // Dummy data
  totalBookings = 45;     // Dummy data

  recentSalons = [
    { name: 'Glamour Salon', ownerName: 'Alice', active: true, createdAt: new Date('2025-11-01') },
    { name: 'Urban Cuts', ownerName: 'Bob', active: false, createdAt: new Date('2025-11-05') },
    { name: 'Style Studio', ownerName: 'Charlie', active: true, createdAt: new Date('2025-11-08') },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
