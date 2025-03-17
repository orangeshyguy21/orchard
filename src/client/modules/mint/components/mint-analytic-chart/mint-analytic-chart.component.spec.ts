import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintBalanceChartComponent } from './mint-balance-chart.component';

describe('MintBalanceChartComponent', () => {
  let component: MintBalanceChartComponent;
  let fixture: ComponentFixture<MintBalanceChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintBalanceChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintBalanceChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
