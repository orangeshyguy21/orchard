import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexHeaderBitcoinComponent } from './index-header-bitcoin.component';

describe('IndexHeaderBitcoinComponent', () => {
  let component: IndexHeaderBitcoinComponent;
  let fixture: ComponentFixture<IndexHeaderBitcoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndexHeaderBitcoinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexHeaderBitcoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
