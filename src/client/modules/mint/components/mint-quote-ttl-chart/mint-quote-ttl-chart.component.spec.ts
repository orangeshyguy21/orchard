import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintQuoteTtlChartComponent } from './mint-quote-ttl-chart.component';

describe('MintQuoteTtlChartComponent', () => {
  let component: MintQuoteTtlChartComponent;
  let fixture: ComponentFixture<MintQuoteTtlChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintQuoteTtlChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintQuoteTtlChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
