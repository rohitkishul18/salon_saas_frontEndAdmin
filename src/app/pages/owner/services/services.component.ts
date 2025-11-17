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

  openModal(edit: boolean, data: any = null) {
    this.isEditing = edit;
    this.form = edit ? { ...data } : {
      id: null,
      name: '',
      durationMinutes: '',
      price: '',
      locationId: ''
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  // ------------------------------
  // LOAD SERVICES
  // ------------------------------
  loadServices() {
    this.loading = true;
    this.serviceApi.getServices().subscribe({
      next: (res: any) => {
        this.services = res.data || [];
        this.loading = false;
      },
      error: () => {
        this.notify("Failed to fetch services");
        this.loading = false;
      }
    });
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
