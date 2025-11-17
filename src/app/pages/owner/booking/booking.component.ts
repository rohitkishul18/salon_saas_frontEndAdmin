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

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;

    this.bookingService.getBookings().subscribe({
      next: (res: any) => {
        this.bookings = res.data;  // backend sends data inside res.data
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
  }


  changeStatus(booking: any) {
    const newStatus = prompt(
      "Enter new status (pending, confirmed, cancelled, done):",
      booking.status
    );

    if (!newStatus) return;

    const allowed = ["pending", "confirmed", "cancelled", "done"];
    if (!allowed.includes(newStatus)) {
      alert("Invalid status!");
      return;
    }

    this.bookingService.updateStatus(booking._id, newStatus).subscribe({
      next: () => {
        booking.status = newStatus; // update UI
        alert("Status updated successfully!");
      },
      error: () => {
        alert("Failed to update status");
      }
    });
  }


  deleteBooking(booking: any) {
    const ok = confirm("Delete this booking?");
    if (!ok) return;

    this.bookings = this.bookings.filter(b => b._id !== booking._id);
    alert("Booking removed from table (backend delete not implemented)");
  }

}
