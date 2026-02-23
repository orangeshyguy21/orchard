import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSubsectionLogEventIconComponent } from './event-subsection-log-event-icon.component';

describe('EventSubsectionLogEventIconComponent', () => {
  let component: EventSubsectionLogEventIconComponent;
  let fixture: ComponentFixture<EventSubsectionLogEventIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventSubsectionLogEventIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventSubsectionLogEventIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
