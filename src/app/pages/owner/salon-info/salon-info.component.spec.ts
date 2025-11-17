import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalonInfoComponent } from './salon-info.component';

describe('SalonInfoComponent', () => {
  let component: SalonInfoComponent;
  let fixture: ComponentFixture<SalonInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalonInfoComponent]
    });
    fixture = TestBed.createComponent(SalonInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
