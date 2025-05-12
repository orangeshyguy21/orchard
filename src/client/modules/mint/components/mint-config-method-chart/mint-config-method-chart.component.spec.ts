import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintConfigMethodChartComponent } from './mint-config-method-chart.component';

describe('MintConfigMethodChartComponent', () => {
  let component: MintConfigMethodChartComponent;
  let fixture: ComponentFixture<MintConfigMethodChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintConfigMethodChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintConfigMethodChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
