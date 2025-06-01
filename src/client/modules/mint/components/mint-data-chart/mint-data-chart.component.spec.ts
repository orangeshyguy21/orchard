import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintDataChartComponent } from './mint-data-chart.component';

describe('MintDataChartComponent', () => {
  let component: MintDataChartComponent;
  let fixture: ComponentFixture<MintDataChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintDataChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintDataChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
