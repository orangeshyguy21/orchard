import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BitcoinSubsectionDisabledComponent } from './bitcoin-subsection-disabled.component';

describe('BitcoinSubsectionDisabledComponent', () => {
  let component: BitcoinSubsectionDisabledComponent;
  let fixture: ComponentFixture<BitcoinSubsectionDisabledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BitcoinSubsectionDisabledComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BitcoinSubsectionDisabledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
