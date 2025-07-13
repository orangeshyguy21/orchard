import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexBitcoinHeaderComponent } from './index-bitcoin-header.component';

describe('IndexBitcoinHeaderComponent', () => {
  let component: IndexBitcoinHeaderComponent;
  let fixture: ComponentFixture<IndexBitcoinHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndexBitcoinHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexBitcoinHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
