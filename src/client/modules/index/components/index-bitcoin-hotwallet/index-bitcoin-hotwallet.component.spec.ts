import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexBitcoinHotwalletComponent } from './index-bitcoin-hotwallet.component';

describe('IndexBitcoinHotwalletComponent', () => {
  let component: IndexBitcoinHotwalletComponent;
  let fixture: ComponentFixture<IndexBitcoinHotwalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndexBitcoinHotwalletComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexBitcoinHotwalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
