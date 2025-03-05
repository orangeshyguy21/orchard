import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicBitcoinComponent } from './graphic-bitcoin.component';

describe('GraphicBitcoinComponent', () => {
  let component: GraphicBitcoinComponent;
  let fixture: ComponentFixture<GraphicBitcoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GraphicBitcoinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphicBitcoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
