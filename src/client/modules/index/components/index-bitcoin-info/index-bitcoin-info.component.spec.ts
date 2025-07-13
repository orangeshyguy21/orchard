import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexBitcoinInfoComponent } from './index-bitcoin-info.component';

describe('IndexBitcoinInfoComponent', () => {
  let component: IndexBitcoinInfoComponent;
  let fixture: ComponentFixture<IndexBitcoinInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndexBitcoinInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexBitcoinInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
