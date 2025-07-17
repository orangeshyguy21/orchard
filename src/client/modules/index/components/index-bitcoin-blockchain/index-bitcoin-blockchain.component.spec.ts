import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexBitcoinBlockchainComponent } from './index-bitcoin-blockchain.component';

describe('IndexBitcoinBlockchainComponent', () => {
  let component: IndexBitcoinBlockchainComponent;
  let fixture: ComponentFixture<IndexBitcoinBlockchainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndexBitcoinBlockchainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexBitcoinBlockchainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
