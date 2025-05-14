import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintConfigChartQuoteTtlComponent } from './mint-config-chart-quote-ttl.component';

describe('MintConfigChartQuoteTtlComponent', () => {
  let component: MintConfigChartQuoteTtlComponent;
  let fixture: ComponentFixture<MintConfigChartQuoteTtlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintConfigChartQuoteTtlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintConfigChartQuoteTtlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
