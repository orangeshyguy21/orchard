import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexEcashHeaderComponent } from './index-ecash-header.component';

describe('IndexEcashHeaderComponent', () => {
  let component: IndexEcashHeaderComponent;
  let fixture: ComponentFixture<IndexEcashHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndexEcashHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexEcashHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
