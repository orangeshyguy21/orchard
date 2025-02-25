import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintSubsectionDashboardComponent } from './mint-subsection-dashboard.component';

describe('MintSubsectionDashboardComponent', () => {
  let component: MintSubsectionDashboardComponent;
  let fixture: ComponentFixture<MintSubsectionDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintSubsectionDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintSubsectionDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
