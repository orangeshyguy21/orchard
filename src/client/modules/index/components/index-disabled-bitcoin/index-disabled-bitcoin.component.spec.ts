import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexDisabledBitcoinComponent } from './index-disabled-bitcoin.component';

describe('IndexDisabledBitcoinComponent', () => {
  let component: IndexDisabledBitcoinComponent;
  let fixture: ComponentFixture<IndexDisabledBitcoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndexDisabledBitcoinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexDisabledBitcoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
