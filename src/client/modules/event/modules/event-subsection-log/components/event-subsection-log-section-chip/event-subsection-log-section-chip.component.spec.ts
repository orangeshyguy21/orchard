import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSubsectionLogSectionChipComponent } from './event-subsection-log-section-chip.component';

describe('EventSubsectionLogSectionChipComponent', () => {
  let component: EventSubsectionLogSectionChipComponent;
  let fixture: ComponentFixture<EventSubsectionLogSectionChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventSubsectionLogSectionChipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventSubsectionLogSectionChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
