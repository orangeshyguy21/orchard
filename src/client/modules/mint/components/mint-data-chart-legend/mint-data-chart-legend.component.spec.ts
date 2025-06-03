import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintDataChartLegendComponent } from './mint-data-chart-legend.component';

describe('MintDataChartLegendComponent', () => {
  let component: MintDataChartLegendComponent;
  let fixture: ComponentFixture<MintDataChartLegendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintDataChartLegendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintDataChartLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
