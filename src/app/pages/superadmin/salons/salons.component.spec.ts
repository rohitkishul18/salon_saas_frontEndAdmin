import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalonsComponent } from './salons.component';

describe('SalonsComponent', () => {
  let component: SalonsComponent;
  let fixture: ComponentFixture<SalonsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalonsComponent]
    });
    fixture = TestBed.createComponent(SalonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
