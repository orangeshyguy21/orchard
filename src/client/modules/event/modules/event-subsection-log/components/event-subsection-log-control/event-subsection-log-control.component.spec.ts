import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSubsectionLogControlComponent } from './event-subsection-log-control.component';

describe('EventSubsectionLogControlComponent', () => {
  let component: EventSubsectionLogControlComponent;
  let fixture: ComponentFixture<EventSubsectionLogControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventSubsectionLogControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventSubsectionLogControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
