import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexDisabledMintComponent } from './index-disabled-mint.component';

describe('IndexDisabledMintComponent', () => {
  let component: IndexDisabledMintComponent;
  let fixture: ComponentFixture<IndexDisabledMintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndexDisabledMintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexDisabledMintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
