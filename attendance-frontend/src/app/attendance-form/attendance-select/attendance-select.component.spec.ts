import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceSelectComponent } from './attendance-select.component';

describe('AttendanceSelectComponent', () => {
  let component: AttendanceSelectComponent;
  let fixture: ComponentFixture<AttendanceSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
