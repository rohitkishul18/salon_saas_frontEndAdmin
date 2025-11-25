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

  // Pagination
  currentPage = 1;
  itemsPerPage = 5;
  totalItems = 0;
  totalPages = 0;

  showModal = false;
  isEdit = false;

  form: any = {
    name: '',
    address: '',
    phone: '',
    openingTime: '',
    closingTime: ''
  };

  editId: string = '';

  // Notification Modal
  showNotificationModal = false;
  notification: any = {
    type: '',
    title: '',
    message: '',
    showConfirm: false,
    onConfirm: undefined
  };

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.loadLocations();
  }

  /**
   * Show notification modal
   */
  showNotification(type: 'success' | 'error' | 'confirm', title: string, message: string, showConfirm = false, onConfirm?: () => void) {
    this.notification = { type, title, message, showConfirm, onConfirm };
    this.showNotificationModal = true;
  }

  /**
   * Close notification modal
   */
  closeNotification() {
    this.showNotificationModal = false;
    this.notification = {
      type: '',
      title: '',
      message: '',
      showConfirm: false,
      onConfirm: undefined
    };
  }

  /**
   * Load locations with pagination
   */
  loadLocations(page?: number) {
    const p = page || this.currentPage;
    this.loading = true;

    this.locationService.getLocations(p, this.itemsPerPage).subscribe({
      next: (res: any) => {
        console.log('Locations fetched:', res);
        this.locations = res.data?.data || res.data || [];
        this.totalItems = res.data?.pagination?.total || res.pagination?.total || 0;
        this.totalPages = res.data?.pagination?.pages || res.pagination?.pages || 0;
        this.currentPage = p;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.showNotification('error', 'Error', 'Failed to load locations');
      }
    });
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.loadLocations(page);
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

  /**
   * Open modal for adding a new location
   */
  openAddModal() {
    this.isEdit = false;
    this.resetForm();
    this.showModal = true;
  }

  /**
   * Open modal for editing an existing location
   */
  openEditModal(loc: any) {
    this.isEdit = true;
    this.editId = loc._id;

    const timingStr = loc.openingHours || loc.timing || '';
    const parts = timingStr.split('-').map((s: string) => s.trim());
    this.form = {
      name: loc.name,
      address: loc.address,
      phone: loc.phone,
      openingTime: parts[0] || '',
      closingTime: parts[1] || ''
    };

    this.showModal = true;
  }

  /**
   * Close the modal and reset the form
   */
  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  /**
   * Reset the form to initial state
   */
  private resetForm() {
    this.form = {
      name: '',
      address: '',
      phone: '',
      openingTime: '',
      closingTime: ''
    };
  }

  /**
   * Save location (create or update based on edit mode)
   */
  saveLocation() {
    if (this.isEdit) {
      this.updateLocation();
    } else {
      this.createLocation();
    }
  }

  /**
   * Create a new location
   */
  createLocation() {
    const payload = {
      name: this.form.name,
      address: this.form.address,
      phone: this.form.phone,
      openingHours: `${this.form.openingTime} - ${this.form.closingTime}`
    };

    this.locationService.createLocation(payload).subscribe({
      next: () => {
        this.showNotification('success', 'Success', 'Location added successfully');
        this.closeModal();
        this.loadLocations(); // Reload current page
      },
      error: () => this.showNotification('error', 'Error', 'Failed to add location')
    });
  }

  /**
   * Update an existing location
   */
  updateLocation() {
    const payload = {
      name: this.form.name,
      address: this.form.address,
      phone: this.form.phone,
      openingHours: `${this.form.openingTime} - ${this.form.closingTime}`
    };

    this.locationService.updateLocation(this.editId, payload).subscribe({
      next: () => {
        this.showNotification('success', 'Success', 'Location updated successfully');
        this.closeModal();
        this.loadLocations(); // Reload current page
      },
      error: () => this.showNotification('error', 'Error', 'Failed to update location')
    });
  }

  /**
   * Delete a location with confirmation
   */
  deleteLocation(loc: any) {
    this.showNotification(
      'confirm', 
      'Confirm Delete', 
      `Are you sure you want to delete "${loc.name}" branch? This branch will be permanently deleted.`, 
      true, 
      () => {
        this.locationService.deleteLocation(loc._id).subscribe({
          next: () => {
            this.showNotification('success', 'Success', 'Location deleted successfully');
            this.loadLocations(); // Reload current page
          },
          error: () => {
            this.showNotification('error', 'Error', 'Failed to delete location');
          }
        });
      }
    );
  }

  /**
   * Get initials from location name for avatar
   */
  getLocationInitial(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  /**
   * Format timing for display in 12-hour format (e.g., 10:00 AM - 8:00 PM)
   */
  getFormattedTiming(loc: any): string {
    const timing = loc.openingHours || loc.timing || '';
    if (!timing) return '';

    const parts = timing.split('-').map((s: string) => s.trim());
    if (parts.length < 2) return timing;

    const openFormatted = this.formatTimeTo12hr(parts[0]);
    const closeFormatted = this.formatTimeTo12hr(parts[1]);
    return `${openFormatted} - ${closeFormatted}`;
  }

  /**
   * Convert 24-hour time string to 12-hour format with AM/PM
   */
  private formatTimeTo12hr(time24: string): string {
    if (!time24 || !time24.includes(':')) return time24;
    const [hours, minutes] = time24.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  }
}