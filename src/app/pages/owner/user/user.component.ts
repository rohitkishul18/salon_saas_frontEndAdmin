import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service'; // Adjust path to your UserService

interface Customer {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
  salonId: string;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  customers: Customer[] = [];
  loading = false;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

  // View Modal
  showViewModal = false;
  selectedCustomer: Customer | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchCustomers(1);
  }

  fetchCustomers(page?: number): void {
    const p = page || this.currentPage;
    this.loading = true;

    this.userService.getCustomers(p, this.itemsPerPage).subscribe({
      next: (response) => {
        if (response.success) {
          this.customers = response.data.customers || [];
          const pagination = response.data.pagination;
          this.totalItems = pagination?.total || 0;
          this.totalPages = pagination?.totalPages || 0;
          this.currentPage = pagination?.currentPage || p;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching customers:', err);
        this.loading = false;
        // Optional: Show toast notification
      }
    });
  }

  refreshCustomers(): void {
    this.fetchCustomers(this.currentPage);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.fetchCustomers(page);
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

  getCustomerInitial(fullName: string): string {
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  viewCustomer(customer: Customer): void {
    this.selectedCustomer = customer;
    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedCustomer = null;
  }
}