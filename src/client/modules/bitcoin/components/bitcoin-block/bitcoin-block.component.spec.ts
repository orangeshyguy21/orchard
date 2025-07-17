import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BitcoinBlockComponent } from './bitcoin-block.component';

describe('BitcoinBlockComponent', () => {
  let component: BitcoinBlockComponent;
  let fixture: ComponentFixture<BitcoinBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BitcoinBlockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BitcoinBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
