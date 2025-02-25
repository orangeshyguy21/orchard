import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BitcoinSectionComponent } from './bitcoin-section.component';

describe('BitcoinSectionComponent', () => {
  let component: BitcoinSectionComponent;
  let fixture: ComponentFixture<BitcoinSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BitcoinSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BitcoinSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
