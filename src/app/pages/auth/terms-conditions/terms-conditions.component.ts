// terms-conditions.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  OnChanges,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss'],
})
export class TermsConditionsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() showModal: boolean = false;
  @Output() close = new EventEmitter<void>();

  ngOnInit(): void {
    if (this.showModal) {
      this.preventBodyScroll();
    }
  }

  ngOnDestroy(): void {
    this.enableBodyScroll();
  }

  ngOnChanges(): void {
    // Handle modal open/close
    if (this.showModal) {
      this.preventBodyScroll();
      setTimeout(() => {
        this.scrollModalToTop();
      }, 50);
    } else {
      this.enableBodyScroll();
    }
  }

  closeModal(): void {
    this.enableBodyScroll();
    this.close.emit();
  }

  @HostListener('window:keydown', ['$event'])
  handleEscapeKey(event: KeyboardEvent): void {
    if (this.showModal && event.key === 'Escape') {
      this.closeModal();
    }
  }

  private scrollModalToTop(): void {
    if (typeof document !== 'undefined') {
      const modalBody = document.querySelector('.modal-body');
      if (modalBody) {
        modalBody.scrollTop = 0;
      }
    }
  }

  private preventBodyScroll(): void {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px';
    }
  }

  private enableBodyScroll(): void {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  }
}
