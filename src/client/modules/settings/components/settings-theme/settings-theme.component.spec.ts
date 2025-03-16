import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsThemeComponent } from './settings-theme.component';

describe('SettingsThemeComponent', () => {
  let component: SettingsThemeComponent;
  let fixture: ComponentFixture<SettingsThemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsThemeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
