import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsTimeTimezoneComponent } from './settings-time-timezone.component';

describe('SettingsTimeTimezoneComponent', () => {
  let component: SettingsTimeTimezoneComponent;
  let fixture: ComponentFixture<SettingsTimeTimezoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsTimeTimezoneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsTimeTimezoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
