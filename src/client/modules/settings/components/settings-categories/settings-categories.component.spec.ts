import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsCategoriesComponent } from './settings-categories.component';

describe('SettingsCategoriesComponent', () => {
  let component: SettingsCategoriesComponent;
  let fixture: ComponentFixture<SettingsCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
