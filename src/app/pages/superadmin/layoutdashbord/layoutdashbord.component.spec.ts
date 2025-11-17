import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutdashbordComponent } from './layoutdashbord.component';

describe('LayoutdashbordComponent', () => {
  let component: LayoutdashbordComponent;
  let fixture: ComponentFixture<LayoutdashbordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LayoutdashbordComponent]
    });
    fixture = TestBed.createComponent(LayoutdashbordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
