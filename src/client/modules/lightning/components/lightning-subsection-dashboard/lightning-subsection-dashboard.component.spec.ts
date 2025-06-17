import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LightningSubsectionDashboardComponent } from './lightning-subsection-dashboard.component';

describe('LightningSubsectionDashboardComponent', () => {
  let component: LightningSubsectionDashboardComponent;
  let fixture: ComponentFixture<LightningSubsectionDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LightningSubsectionDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LightningSubsectionDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
