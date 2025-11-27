// terms-conditions.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, HostListener } from '@angular/core';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss']
})
export class TermsConditionsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() showModal: boolean = false;
  @Output() close = new EventEmitter<void>();

  ngOnInit(): void {
    // Prevent body scroll when modal is open
    if (this.showModal) {
      this.preventBodyScroll();
    }
  }

  ngOnDestroy(): void {
    // Restore body scroll when component is destroyed
    this.enableBodyScroll();
  }

  ngOnChanges(): void {
    // Handle modal open/close
    if (this.showModal) {
      this.preventBodyScroll();
      // Small delay to ensure smooth rendering
      setTimeout(() => {
        this.scrollModalToTop();
      }, 50);
    } else {
      this.enableBodyScroll();
    }
  }

  /**
   * Close modal and emit event
   */
  closeModal(): void {
    this.enableBodyScroll();
    this.close.emit();
  }

  /**
   * Handle ESC key to close modal
   */
  @HostListener('window:keydown', ['$event'])
  handleEscapeKey(event: KeyboardEvent): void {
    if (this.showModal && event.key === 'Escape') {
      this.closeModal();
    }
  }

  /**
   * Scroll modal body to top when opened
   */
  private scrollModalToTop(): void {
    if (typeof document !== 'undefined') {
      const modalBody = document.querySelector('.modal-body');
      if (modalBody) {
        modalBody.scrollTop = 0;
      }
    }
  }

  /**
   * Prevent body scroll when modal is open
   */
  private preventBodyScroll(): void {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px'; // Prevent layout shift
    }
  }

  /**
   * Enable body scroll when modal is closed
   */
  private enableBodyScroll(): void {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  }
}