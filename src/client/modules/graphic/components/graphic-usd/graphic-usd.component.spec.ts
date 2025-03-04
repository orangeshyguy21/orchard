import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicUsdComponent } from './graphic-usd.component';

describe('GraphicUsdComponent', () => {
  let component: GraphicUsdComponent;
  let fixture: ComponentFixture<GraphicUsdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GraphicUsdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphicUsdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
