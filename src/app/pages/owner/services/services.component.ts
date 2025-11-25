import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../../core/services/service.service';
import { LocationService } from '../../../core/services/location.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  services: any[] = [];
  locations: any[] = [];
  selectedLocations: any[] = [];
  availableLocations: any[] = [];
  loading = false;
  locationLoading = false;

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
    locationIds: []
  };

  // Notification Modal
  showNotificationModal = false;
  notification: any = {
    title: '',
    message: ''
  };

  // Delete Modal
  showDeleteModal = false;
  selectedService: any = null;

  constructor(
    private serviceApi: ServiceService,
    private locationService: LocationService
  ) {}

  ngOnInit() {
    this.loadServices();
    this.loadLocations();
  }

  /**
   * Get formatted duration display (e.g., "1 hour 30 minutes" or "45 minutes")
   */
  getFormattedDuration(minutes: number): string {
    if (!minutes || minutes <= 0) return '';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins} minute${mins !== 1 ? 's' : ''}`;
    } else if (mins === 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours !== 1 ? 's' : ''} ${mins} minute${mins !== 1 ? 's' : ''}`;
    }
  }

  /**
   * Get duration helper text with emoji
   */
  getDurationHelperText(minutes: number): string {
    if (!minutes || minutes <= 0) return '⏱️ Enter service duration';
    
    if (minutes < 30) {
      return '⚡ Quick service - Perfect for touch-ups';
    } else if (minutes >= 30 && minutes < 60) {
      return '⏰ Standard service duration';
    } else if (minutes >= 60 && minutes < 120) {
      return '🕐 Extended service - Reserve enough time';
    } else {
      return '📅 Long service - Multiple hours required';
    }
  }

  /**
   * Load all locations for the salon
   */
  loadLocations() {
    this.locationLoading = true;
    this.locationService.getLocations(1, 100).subscribe({
      next: (res: any) => {
        this.locations = res.data?.data || res.data || [];
        this.updateAvailableLocations();
        this.locationLoading = false;
      },
      error: () => {
        this.showNotification('Error', 'Failed to load locations');
        this.locationLoading = false;
      }
    });
  }

  /**
   * Update available locations based on selected ones
   */
  updateAvailableLocations() {
    const selectedIds = this.selectedLocations.map(loc => loc._id);
    this.availableLocations = this.locations.filter(loc => !selectedIds.includes(loc._id));
  }

  /**
   * Add a location from dropdown
   */
  addLocation(event: any) {
    const locationId = event.target.value;
    if (!locationId) return;

    const location = this.locations.find(loc => loc._id === locationId);
    if (location && !this.selectedLocations.find(loc => loc._id === locationId)) {
      this.selectedLocations.push(location);
      this.updateAvailableLocations();
      this.updateFormLocationIds();
    }

    event.target.value = '';
  }

  /**
   * Remove a location chip
   */
  removeLocation(locationId: string) {
    this.selectedLocations = this.selectedLocations.filter(loc => loc._id !== locationId);
    this.updateAvailableLocations();
    this.updateFormLocationIds();
  }

  /**
   * Update form.locationIds array based on selected locations
   */
  updateFormLocationIds() {
    this.form.locationIds = this.selectedLocations.map(loc => loc._id);
  }

  /**
   * Show notification modal
   */
  showNotification(title: string, message: string) {
    this.notification = { title, message };
    this.showNotificationModal = true;
  }

  /**
   * Close notification modal
   */
  closeNotification() {
    this.showNotificationModal = false;
  }

  /**
   * Open delete confirmation modal
   */
  openDeleteModal(service: any) {
    this.selectedService = service;
    this.showDeleteModal = true;
  }

  /**
   * Close delete modal
   */
  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedService = null;
  }

  /**
   * Confirm and delete service
   */
  confirmDelete() {
    if (!this.selectedService) return;

    this.serviceApi.deleteService(this.selectedService._id || this.selectedService.id).subscribe({
      next: () => {
        this.showNotification('Success', 'Service deleted successfully');
        this.loadServices();
        this.closeDeleteModal();
      },
      error: () => {
        this.showNotification('Error', 'Failed to delete service');
        this.closeDeleteModal();
      }
    });
  }

  /**
   * Get comma-separated location names for display in table
   */
  getLocationNames(item: any): string {
    if (!item.locationIds || item.locationIds.length === 0) return '-';
    return item.locationIds.map((loc: any) => loc.name || loc).join(', ');
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
    
    if (edit && data) {
      this.form = { 
        ...data,
        locationIds: []
      };

      if (data.locationIds && Array.isArray(data.locationIds)) {
        this.selectedLocations = data.locationIds.map((loc: any) => {
          if (typeof loc === 'object' && loc._id) {
            return loc;
          }
          return this.locations.find(l => l._id === loc) || { _id: loc, name: 'Unknown' };
        });
      } else {
        this.selectedLocations = [];
      }
      
      this.updateFormLocationIds();
      this.updateAvailableLocations();
    } else {
      this.form = {
        id: null,
        name: '',
        durationMinutes: '',
        price: '',
        locationIds: []
      };
      this.selectedLocations = [];
      this.updateAvailableLocations();
    }
    
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedLocations = [];
    this.form = {
      id: null,
      name: '',
      durationMinutes: '',
      price: '',
      locationIds: []
    };
    this.updateAvailableLocations();
  }

  /**
   * Load services with pagination
   */
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
        this.showNotification('Error', 'Failed to fetch services');
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
      rangeWithEllipsis.push(1, -1);
    } else {
      rangeWithEllipsis.push(1);
    }

    rangeWithEllipsis.push(...range);

    if (this.currentPage + delta < this.totalPages - 1) {
      rangeWithEllipsis.push(-1, this.totalPages);
    } else {
      rangeWithEllipsis.push(this.totalPages);
    }

    return rangeWithEllipsis.filter(p => p !== -1);
  }

  getShowingFrom(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getShowingTo(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

  /**
   * Save service (add or update)
   */
  saveService() {
    if (!this.form.name || !this.form.durationMinutes || !this.form.price || this.selectedLocations.length === 0) {
      this.showNotification('Error', 'All fields are required, including at least one location');
      return;
    }

    this.updateFormLocationIds();
    this.isEditing ? this.updateService() : this.addService();
  }

  addService() {
    this.serviceApi.addService(this.form).subscribe({
      next: () => {
        this.showNotification('Success', 'Service added successfully');
        this.closeModal();
        this.loadServices();
      },
      error: () => this.showNotification('Error', 'Failed to add service')
    });
  }

  updateService() {
    this.serviceApi.updateService(this.form._id || this.form.id, this.form).subscribe({
      next: () => {
        this.showNotification('Success', 'Service updated successfully');
        this.closeModal();
        this.loadServices();
      },
      error: () => this.showNotification('Error', 'Failed to update service')
    });
  }
}