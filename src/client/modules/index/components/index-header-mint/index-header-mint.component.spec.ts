import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexHeaderMintComponent } from './index-header-mint.component';

describe('IndexHeaderMintComponent', () => {
  let component: IndexHeaderMintComponent;
  let fixture: ComponentFixture<IndexHeaderMintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndexHeaderMintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexHeaderMintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
