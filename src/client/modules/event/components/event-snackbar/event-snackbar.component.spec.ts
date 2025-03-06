import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSnackbarComponent } from './event-snackbar.component';

describe('EventSnackbarComponent', () => {
  let component: EventSnackbarComponent;
  let fixture: ComponentFixture<EventSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventSnackbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
