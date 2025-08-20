import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberSelectComponent } from './member-select.component';

describe('AttendanceSelectComponent', () => {
  let component: MemberSelectComponent;
  let fixture: ComponentFixture<MemberSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
