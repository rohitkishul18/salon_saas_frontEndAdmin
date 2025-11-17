import { Component, OnInit } from '@angular/core';
import { LocationService } from '../../../core/services/location.service';
// import Swal from 'sweetalert2';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {

  locations: any[] = [];
  loading = false;

  showModal = false;
  isEdit = false;

  form: any = {
    name: '',
    address: '',
    phone: '',
    timing: ''
  };

  editId: string = '';

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.getLocations();
  }

  // ============================
  // GET LOCATIONS
  // ============================
  getLocations() {
    this.loading = true;

    this.locationService.getLocations().subscribe({
      next: (res) => {
        console.log(res);
        this.locations = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        // Swal.fire('Error', 'Failed to load locations', 'error');
        alert('Failed to load locations');
      }
    });
  }

  // ============================
  // OPEN ADD MODAL
  // ============================
  openAddModal() {
    this.isEdit = false;
    this.form = { name: '', address: '', phone: '', timing: '' };
    this.showModal = true;
  }

  // ============================
  // OPEN EDIT MODAL
  // ============================
  openEditModal(loc: any) {
    this.isEdit = true;
    this.editId = loc._id;

    this.form = {
      name: loc.name,
      address: loc.address,
      phone: loc.phone,
      timing: loc.openingHours ? loc.openingHours : loc.timing
    };

    this.showModal = true;
  }

  // ============================
  // CLOSE MODAL
  // ============================
  closeModal() {
    this.showModal = false;
  }

  // ============================
  // SAVE (CREATE / UPDATE)
  // ============================
  saveLocation() {
    if (this.isEdit) {
      this.updateLocation();
    } else {
      this.createLocation();
    }
  }

  // CREATE
  createLocation() {
    const payload = {
      name: this.form.name,
      address: this.form.address,
      phone: this.form.phone,
      openingHours: this.form.timing
    };

    this.locationService.createLocation(payload).subscribe({
      next: () => {
       alert('Location added successfully');
        this.closeModal();
        this.getLocations();
      },
      error: () => alert('Failed to add location')
    });
  }

  // UPDATE
  updateLocation() {
    const payload = {
      name: this.form.name,
      address: this.form.address,
      phone: this.form.phone,
      openingHours: this.form.timing
    };

    this.locationService.updateLocation(this.editId, payload).subscribe({
      next: () => {
        alert('Location updated successfully');
        this.closeModal();
        this.getLocations();
      },
      error: () => alert('Failed to update location')
    });
  }

  // ============================
  // DELETE
  // ============================
  deleteLocation(loc: any) {
  const confirmation = confirm('Are you sure you want to delete this location?');

  if (confirmation) {
    this.locationService.deleteLocation(loc._id).subscribe({
      next: () => {
        alert('Location deleted successfully');
        this.getLocations();
      },
      error: () => {
        alert('Failed to delete location');
      }
    });
  }
}
}
