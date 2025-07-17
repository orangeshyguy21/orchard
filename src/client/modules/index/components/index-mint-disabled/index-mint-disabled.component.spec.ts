import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexMintDisabledComponent } from './index-mint-disabled.component';

describe('IndexMintDisabledComponent', () => {
  let component: IndexMintDisabledComponent;
  let fixture: ComponentFixture<IndexMintDisabledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndexMintDisabledComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexMintDisabledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
