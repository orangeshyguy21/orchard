import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BitcoinUtxoStackComponent } from './bitcoin-utxo-stack.component';

describe('BitcoinUtxoStackComponent', () => {
  let component: BitcoinUtxoStackComponent;
  let fixture: ComponentFixture<BitcoinUtxoStackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BitcoinUtxoStackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BitcoinUtxoStackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
