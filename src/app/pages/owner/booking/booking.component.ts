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

  showDetails = false;
  selected: any = null;

  showStatusModal = false;
  currentBooking: any = null;
  newStatus: string = '';

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;

    this.bookingService.getBookings().subscribe({
      next: (res: any) => {
        this.bookings = res.data || [];  // backend sends data inside res.data
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Failed to load bookings');
      }
    });
  }

  viewDetails(booking: any) {
    this.selected = booking;
    this.showDetails = true;
  }

  closeDetails() {
    this.showDetails = false;
    this.selected = null;
  }

  openStatusModal(booking: any) {
    this.currentBooking = booking;
    this.newStatus = booking.status;
    this.showStatusModal = true;
  }

  closeStatusModal() {
    this.showStatusModal = false;
    this.currentBooking = null;
    this.newStatus = '';
  }

  updateStatus() {
    if (this.newStatus === this.currentBooking.status) {
      return;
    }

    const allowed = ["pending", "confirmed", "cancelled", "done"];
    if (!allowed.includes(this.newStatus)) {
      alert("Invalid status!");
      return;
    }

    this.bookingService.updateStatus(this.currentBooking._id, this.newStatus).subscribe({
      next: () => {
        this.currentBooking.status = this.newStatus; // update UI
        alert("Status updated successfully!");
        this.closeStatusModal();
      },
      error: () => {
        alert("Failed to update status");
        this.closeStatusModal();
      }
    });
  }

  deleteBooking(booking: any) {
    const ok = confirm("Delete this booking?");
    if (!ok) return;
    this.bookingService.deleteBooking(booking._id).subscribe({
      next: () => {
        this.loadBookings();
      },
      error: () => {
        alert("Failed to delete booking");
      }
    })
  }

  getCustomerInitial(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

}