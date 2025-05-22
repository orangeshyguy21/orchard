import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsAiComponent } from './settings-ai.component';

describe('SettingsAiComponent', () => {
  let component: SettingsAiComponent;
  let fixture: ComponentFixture<SettingsAiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsAiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
