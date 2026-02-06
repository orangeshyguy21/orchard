import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BitcoinGeneralWalletSummaryComponent } from './bitcoin-general-wallet-summary.component';

describe('BitcoinGeneralWalletSummaryComponent', () => {
  let component: BitcoinGeneralWalletSummaryComponent;
  let fixture: ComponentFixture<BitcoinGeneralWalletSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BitcoinGeneralWalletSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BitcoinGeneralWalletSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
