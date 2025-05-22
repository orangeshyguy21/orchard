import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintKeysetChartComponent } from './mint-keyset-chart.component';

describe('MintKeysetChartComponent', () => {
  let component: MintKeysetChartComponent;
  let fixture: ComponentFixture<MintKeysetChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintKeysetChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintKeysetChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
