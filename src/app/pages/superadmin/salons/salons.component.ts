import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-salons',
  templateUrl: './salons.component.html',
  styleUrls: ['./salons.component.scss']
})
export class SalonsComponent implements OnInit {

  salons = [
    { name: 'Glamour Salon', ownerName: 'Alice', email: 'alice@example.com', phone: '1234567890', active: true, createdAt: new Date('2025-11-01') },
    { name: 'Urban Cuts', ownerName: 'Bob', email: 'bob@example.com', phone: '2345678901', active: false, createdAt: new Date('2025-11-05') },
    { name: 'Style Studio', ownerName: 'Charlie', email: 'charlie@example.com', phone: '3456789012', active: true, createdAt: new Date('2025-11-08') },
    { name: 'Elegance Hair', ownerName: 'David', email: 'david@example.com', phone: '4567890123', active: true, createdAt: new Date('2025-11-10') },
    { name: 'Chic Cuts', ownerName: 'Eva', email: 'eva@example.com', phone: '5678901234', active: false, createdAt: new Date('2025-11-12') },
  ];

  constructor() { }

  ngOnInit(): void {
  }

  toggleStatus(salon: any) {
    salon.active = !salon.active;
  }

}
