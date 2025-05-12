import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintConfigChartMethodComponent } from './mint-config-chart-method.component';

describe('MintConfigChartMethodComponent', () => {
  let component: MintConfigChartMethodComponent;
  let fixture: ComponentFixture<MintConfigChartMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintConfigChartMethodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintConfigChartMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
