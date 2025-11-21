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
  filteredSalons: any[] = [];
  
  // Search and filter
  searchTerm: string = '';
  filterStatus: 'all' | 'active' | 'inactive' = 'all';

  constructor(private superAdminService: SuperadminService) {}

  ngOnInit(): void {
    this.loadSalons();
  }

  loadSalons() {
    this.loading = true;

    this.superAdminService.getAllSalons().subscribe({
      next: (res: any) => {
        this.salons = res.data || [];
        this.filterSalons();
        this.loading = false;
      },

      error: (err) => {
        console.error('Error loading salons:', err);
        this.loading = false;
        this.showNotification('Failed to load salons', 'error');
      }
    });
  }

  toggleStatus(salon: any) {
    // Prevent multiple clicks
    if (salon.isUpdating) return;

    const newStatus = !salon.ownerActive;
    salon.isUpdating = true;

    this.superAdminService.updateOwnerStatus(salon.id, newStatus).subscribe({
      next: () => {
        salon.ownerActive = newStatus;
        salon.isUpdating = false;
        
        const statusText = newStatus ? 'activated' : 'deactivated';
        this.showNotification(`Salon ${statusText} successfully`, 'success');
        
        // Update filtered list
        this.filterSalons();
      },
      
      error: (err) => {
        console.error('Error updating salon status:', err);
        salon.isUpdating = false;
        this.showNotification('Failed to update salon status', 'error');
      }
    });
  }

  /**
   * Filter salons based on search term and status
   */
  filterSalons() {
    let filtered = [...this.salons];

    // Apply status filter
    if (this.filterStatus === 'active') {
      filtered = filtered.filter(s => s.ownerActive);
    } else if (this.filterStatus === 'inactive') {
      filtered = filtered.filter(s => !s.ownerActive);
    }

    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(salon => 
        salon.name?.toLowerCase().includes(term) ||
        salon.ownerName?.toLowerCase().includes(term) ||
        salon.email?.toLowerCase().includes(term) ||
        salon.phone?.toLowerCase().includes(term)
      );
    }

    this.filteredSalons = filtered;
  }

  /**
   * Set filter status
   */
  setFilter(status: 'all' | 'active' | 'inactive') {
    this.filterStatus = status;
    this.filterSalons();
  }

  /**
   * Get salon initial for avatar
   */
  getSalonInitial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  /**
   * Get active salons count
   */
  getActiveSalonsCount(): number {
    return this.salons.filter(s => s.ownerActive).length;
  }

  /**
   * Get inactive salons count
   */
  getInactiveSalonsCount(): number {
    return this.salons.filter(s => !s.ownerActive).length;
  }

  /**
   * Show notification (replace with your toast/notification service)
   */
  private showNotification(message: string, type: 'success' | 'error') {
    // For now using alert, replace with your notification library
    // e.g., Swal.fire, toastr, or Angular Material Snackbar
    if (type === 'success') {
      alert(`✅ ${message}`);
    } else {
      alert(`❌ ${message}`);
    }
  }

}