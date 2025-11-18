import { Component, OnInit } from '@angular/core';
import { SuperadminService } from '../../../core/services/superadmin.service';

@Component({
  selector: 'app-salons',
  templateUrl: './salons.component.html',
  styleUrls: ['./salons.component.scss']
})
export class SalonsComponent implements OnInit {

  loading = true;
  salons: any[] = [];

  constructor(private superAdminService: SuperadminService) {}

  ngOnInit(): void {
    this.loadSalons();
  }

  loadSalons() {
    this.superAdminService.getAllSalons().subscribe({
      next: (res: any) => {
        this.salons = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  toggleStatus(salon: any) {

    const newStatus = !salon.ownerActive;

    this.superAdminService.updateOwnerStatus(salon.id, newStatus).subscribe({
      next: () => {

        salon.ownerActive = newStatus; // update UI instantly
        alert('Salon status updated successfully');
      },
      error: () => {
       alert('Failed to update salon status');
      }
    });

  }

}
