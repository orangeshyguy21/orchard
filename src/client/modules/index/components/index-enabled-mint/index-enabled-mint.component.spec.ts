import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexEnabledMintComponent } from './index-enabled-mint.component';

describe('IndexEnabledMintComponent', () => {
  let component: IndexEnabledMintComponent;
  let fixture: ComponentFixture<IndexEnabledMintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndexEnabledMintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexEnabledMintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
