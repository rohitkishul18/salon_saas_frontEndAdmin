import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../core/services/booking.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  bookings: any[] = [];
  loading = true;

  // Pagination
  currentPage = 1;
  itemsPerPage = 5;
  totalItems = 0;
  totalPages = 0;

  // Modals
  showDetails = false;
  selected: any = null;
  showStatusModal = false;
  currentBooking: any = null;
  newStatus: string = '';

  // Error handling
  errorMessage: string = '';
  isUpdating: boolean = false;

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.loadBookings();
  }

  /**
   * Load bookings with pagination
   */
  loadBookings(page: number = this.currentPage, limit: number = this.itemsPerPage) {
    this.loading = true;
    this.errorMessage = '';

    this.bookingService.getBookings(page, limit).subscribe({
      next: (res: any) => {
        console.log('booking res',res);
        // Handle different response structures
        const responseData = res.data || res;
        
        this.bookings = responseData.data || responseData.bookings || responseData || [];
        
        // Handle pagination data
        const pagination = responseData.pagination || res.pagination || {};
        this.totalItems = pagination.total || this.bookings.length;
        this.totalPages = pagination.pages || Math.ceil(this.totalItems / limit);
        this.currentPage = page;
        
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = this.getErrorMessage(err);
        console.error('Failed to load bookings:', err);
      }
    });
  }

  /**
   * Change page
   */
  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.loadBookings(page, this.itemsPerPage);
  }

  /**
   * Get visible page numbers for pagination
   */
  getVisiblePages(): number[] {
    const delta = 2;
    const range = [];
    const rangeWithDots: number[] = [];
    let l: number;

    for (let i = 1; i <= this.totalPages; i++) {
      if (i === 1 || i === this.totalPages || (i >= this.currentPage - delta && i <= this.currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push(-1); // -1 represents ellipsis
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots.filter(p => p !== -1);
  }

  /**
   * Get showing from index
   */
  getShowingFrom(): number {
    return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  /**
   * Get showing to index
   */
  getShowingTo(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

  /**
   * View booking details
   */
  viewDetails(booking: any) {
    this.selected = booking;
    this.showDetails = true;
  }

  /**
   * Close details modal
   */
  closeDetails() {
    this.showDetails = false;
    this.selected = null;
  }

  /**
   * Open status change modal
   */
  openStatusModal(booking: any) {
    this.currentBooking = booking;
    this.newStatus = booking.status;
    this.showStatusModal = true;
  }

  /**
   * Close status modal
   */
  closeStatusModal() {
    this.showStatusModal = false;
    this.currentBooking = null;
    this.newStatus = '';
    this.errorMessage = '';
  }

  /**
   * Update booking status
   */
  updateStatus() {
    if (this.newStatus === this.currentBooking?.status) {
      return;
    }

    const allowedStatuses = ["pending", "confirmed", "cancelled", "done"];
    if (!allowedStatuses.includes(this.newStatus)) {
      this.errorMessage = "Invalid status selected!";
      return;
    }

    this.isUpdating = true;
    this.errorMessage = '';

    this.bookingService.updateStatus(this.currentBooking._id, this.newStatus).subscribe({
      next: (res: any) => {
        // Update the booking in the list
        const index = this.bookings.findIndex(b => b._id === this.currentBooking._id);
        if (index !== -1) {
          this.bookings[index].status = this.newStatus;
        }
        
        this.isUpdating = false;
        this.closeStatusModal();
        
        // Show success message briefly
        this.errorMessage = '';
      },
      error: (err) => {
        this.isUpdating = false;
        this.errorMessage = this.getErrorMessage(err, 'Failed to update status');
      }
    });
  }

  /**
   * Delete booking
   */
  deleteBooking(booking: any) {
    if (!confirm(`Are you sure you want to delete booking for ${booking.customerName}?`)) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.bookingService.deleteBooking(booking._id).subscribe({
      next: () => {
        // Reload current page or go to previous page if current page becomes empty
        const remainingItems = this.totalItems - 1;
        const newTotalPages = Math.ceil(remainingItems / this.itemsPerPage);
        
        if (this.currentPage > newTotalPages && newTotalPages > 0) {
          this.loadBookings(newTotalPages, this.itemsPerPage);
        } else {
          this.loadBookings(this.currentPage, this.itemsPerPage);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = this.getErrorMessage(err, 'Failed to delete booking');
      }
    });
  }

  /**
   * Get customer initials for avatar
   */
  getCustomerInitial(name: string): string {
    if (!name) return '?';
    
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  /**
   * Get branch/location name
   */
  getBranchName(booking: any): string {
    return booking.locationId?.name || 'N/A';
  }

  /**
   * Get service title
   */
  getServiceTitle(booking: any): string {
    return booking.serviceId?.name || 'N/A';
  }

  /**
   * Get service price
   */
  getServicePrice(booking: any): number {
    return booking.serviceId?.price || 0;
  }

  /**
   * Get error message from error object
   */
  private getErrorMessage(err: any, defaultMessage: string = 'An error occurred'): string {
    if (err.error?.message) {
      return err.error.message;
    } else if (err.error?.error) {
      return err.error.error;
    } else if (err.status === 0) {
      return 'Network error. Please check your connection.';
    } else if (err.status === 404) {
      return 'Resource not found.';
    } else if (err.status === 403) {
      return 'You do not have permission to perform this action.';
    } else if (err.status >= 500) {
      return 'Server error. Please try again later.';
    } else {
      return defaultMessage;
    }
  }

  /**
   * Retry loading bookings
   */
  retryLoad() {
    this.loadBookings(this.currentPage, this.itemsPerPage);
  }

  /**
   * Clear error message
   */
  clearError() {
    this.errorMessage = '';
  }
}