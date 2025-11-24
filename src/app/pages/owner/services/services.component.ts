import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../../core/services/service.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  services: any[] = [];
  loading = false;

  // Pagination
  currentPage = 1;
  itemsPerPage = 5;
  totalItems = 0;
  totalPages = 0;

  showModal = false;
  isEditing = false;

  form: any = {
    id: null,
    name: '',
    durationMinutes: '',
    price: '',
    locationId: ''
  };

  constructor(private serviceApi: ServiceService) {}

  ngOnInit() {
    this.loadServices();
  }

  // ------------------------------
  // HELPERS
  // ------------------------------
  notify(msg: string) {
    alert(msg);
  }

  ask(msg: string) {
    return confirm(msg);
  }

  getServiceInitial(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  openModal(edit: boolean, data: any = null) {
    this.isEditing = edit;
    console.log(edit, data);  
    if (edit) {
      this.form = { 
        ...data, 
        locationId: data.locationId?._id || '' 
      };
    } else {
      this.form = {
        id: null,
        name: '',
        durationMinutes: '',
        price: '',
        locationId: ''
      };
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.form = {
      id: null,
      name: '',
      durationMinutes: '',
      price: '',
      locationId: ''
    };
  }

  // ------------------------------
  // LOAD SERVICES
  // ------------------------------
  loadServices(page?: number) {
    const p = page || this.currentPage;
    this.loading = true;
    this.serviceApi.getServices(p, this.itemsPerPage).subscribe({
      next: (res: any) => {
        this.services = res.data?.data || res.data || [];
        this.totalItems = res.data?.pagination?.total || res.pagination?.total || 0;
        this.totalPages = res.data?.pagination?.pages || res.pagination?.pages || 0;
        this.currentPage = p;
        this.loading = false;
      },
      error: () => {
        this.notify("Failed to fetch services");
        this.loading = false;
      }
    });
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.loadServices(page);
  }

  getVisiblePages(): number[] {
    const delta = 2;
    const range = [];
    const rangeWithEllipsis = [];

    for (let i = Math.max(2, this.currentPage - delta); i <= Math.min(this.totalPages - 1, this.currentPage + delta); i++) {
      range.push(i);
    }

    if (this.currentPage - delta > 2) {
      rangeWithEllipsis.push(1, -1); // -1 represents ellipsis
    } else {
      rangeWithEllipsis.push(1);
    }

    rangeWithEllipsis.push(...range);

    if (this.currentPage + delta < this.totalPages - 1) {
      rangeWithEllipsis.push(-1, this.totalPages);
    } else {
      rangeWithEllipsis.push(this.totalPages);
    }

    return rangeWithEllipsis.filter(p => p !== -1); // Filter out ellipsis for now; can add logic to show '...' if needed
  }

  getShowingFrom(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getShowingTo(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

  // ------------------------------
  // SAVE (ADD / UPDATE)
  // ------------------------------
  saveService() {
    if (!this.form.name || !this.form.durationMinutes || !this.form.price || !this.form.locationId) {
      return this.notify("All fields are required");
    }

    this.isEditing ? this.updateService() : this.addService();
  }

  addService() {
    this.serviceApi.addService(this.form).subscribe({
      next: () => {
        this.notify("Service added successfully");
        this.closeModal();
        this.loadServices();
      },
      error: () => this.notify("Failed to add service")
    });
  }

  updateService() {
    this.serviceApi.updateService(this.form._id || this.form.id, this.form).subscribe({
      next: () => {
        this.notify("Service updated successfully");
        this.closeModal();
        this.loadServices();
      },
      error: () => this.notify("Failed to update service")
    });
  }

  // ------------------------------
  // DELETE
  // ------------------------------
  deleteService(item: any) {
    if (!this.ask(`Delete service "${item.name}"?`)) return;

    this.serviceApi.deleteService(item._id || item.id).subscribe({
      next: () => {
        this.notify("Service deleted successfully");
        this.loadServices();
      },
      error: () => this.notify("Failed to delete service")
    });
  }

}