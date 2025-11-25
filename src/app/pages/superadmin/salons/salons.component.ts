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

  // Modal states
  showConfirmModal = false;
  confirmAction: 'activate' | 'deactivate' | null = null;
  selectedSalon: any = null;
  showNotificationModal = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';

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
        this.showNotification('Failed to load salons. Please try refreshing the page.', 'error');
      }
    });
  }

  /**
   * Open confirmation modal for status toggle
   */
  openToggleConfirm(salon: any) {
    this.selectedSalon = salon;
    this.confirmAction = salon.ownerActive ? 'deactivate' : 'activate';
    this.showConfirmModal = true;
  }

  /**
   * Confirm and execute status toggle
   */
  confirmToggle() {
    if (!this.selectedSalon || this.confirmAction === null) return;

    // Prevent multiple clicks
    if (this.selectedSalon.isUpdating) return;

    const newStatus = this.confirmAction === 'activate';
    this.selectedSalon.isUpdating = true;
    this.showConfirmModal = false;

    this.superAdminService.updateOwnerStatus(this.selectedSalon.id, newStatus).subscribe({
      next: () => {
        this.selectedSalon.ownerActive = newStatus;
        this.selectedSalon.isUpdating = false;
        
        const statusText = newStatus ? 'activated' : 'deactivated';
        this.showNotification(`Salon "${this.selectedSalon.name}" has been ${statusText} successfully. The owner will now ${newStatus ? 'gain full access' : 'lose access'} to the system.`, 'success');
        
        // Update filtered list
        this.filterSalons();
      },
      
      error: (err) => {
        console.error('Error updating salon status:', err);
        this.selectedSalon.isUpdating = false;
        this.showNotification('Failed to update salon status. Please try again.', 'error');
      }
    });
  }

  /**
   * Close confirmation modal
   */
  closeConfirmModal() {
    this.showConfirmModal = false;
    this.selectedSalon = null;
    this.confirmAction = null;
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
   * Show notification via modal
   */
  private showNotification(message: string, type: 'success' | 'error') {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotificationModal = true;

    // Auto-close after 4 seconds
    setTimeout(() => {
      this.closeNotificationModal();
    }, 4000);
  }

  /**
   * Close notification modal
   */
  closeNotificationModal() {
    this.showNotificationModal = false;
    this.notificationMessage = '';
    this.notificationType = 'success';
  }

  /**
   * Get confirmation message based on action
   */
  getConfirmMessage(): string {
    if (this.confirmAction === 'deactivate') {
      return `Are you sure you want to deactivate "${this.selectedSalon?.name}"? This action will immediately revoke the owner's access to the salon management system, including booking features and analytics. The salon will appear as inactive until reactivated. This cannot be undone without manual intervention.`;
    } else if (this.confirmAction === 'activate') {
      return `Are you sure you want to activate "${this.selectedSalon?.name}"? This will restore full access for the owner, enabling them to manage bookings, view analytics, and operate normally. Ensure all compliance checks are complete before proceeding.`;
    }
    return '';
  }

  /**
   * Get confirmation title based on action
   */
  getConfirmTitle(): string {
    return this.confirmAction === 'deactivate' ? 'Deactivate Salon?' : 'Activate Salon?';
  }

  /**
   * Get confirmation icon based on action
   */
  getConfirmIcon(): string {
    return this.confirmAction === 'deactivate' ? '⚠️' : '✅';
  }
}