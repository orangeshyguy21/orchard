import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexMintInfoComponent } from './index-mint-info.component';

describe('IndexMintInfoComponent', () => {
  let component: IndexMintInfoComponent;
  let fixture: ComponentFixture<IndexMintInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndexMintInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexMintInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
