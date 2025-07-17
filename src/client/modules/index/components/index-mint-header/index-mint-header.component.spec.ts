import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexMintHeaderComponent } from './index-mint-header.component';

describe('IndexMintHeaderComponent', () => {
  let component: IndexMintHeaderComponent;
  let fixture: ComponentFixture<IndexMintHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndexMintHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexMintHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
