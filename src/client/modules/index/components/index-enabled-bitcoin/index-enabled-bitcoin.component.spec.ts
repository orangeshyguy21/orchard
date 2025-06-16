import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexEnabledBitcoinComponent } from './index-enabled-bitcoin.component';

describe('IndexEnabledBitcoinComponent', () => {
  let component: IndexEnabledBitcoinComponent;
  let fixture: ComponentFixture<IndexEnabledBitcoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndexEnabledBitcoinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexEnabledBitcoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
