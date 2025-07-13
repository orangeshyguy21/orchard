import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexMintEnabledComponent } from './index-mint-enabled.component';

describe('IndexMintEnabledComponent', () => {
  let component: IndexMintEnabledComponent;
  let fixture: ComponentFixture<IndexMintEnabledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndexMintEnabledComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexMintEnabledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
