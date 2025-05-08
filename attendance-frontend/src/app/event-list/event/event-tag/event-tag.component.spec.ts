import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTagComponent } from './event-tag.component';

describe('EventTagComponent', () => {
  let component: EventTagComponent;
  let fixture: ComponentFixture<EventTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventTagComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
