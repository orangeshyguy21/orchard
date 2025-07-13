import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexEcashEnabledComponent } from './index-ecash-enabled.component';

describe('IndexEcashEnabledComponent', () => {
  let component: IndexEcashEnabledComponent;
  let fixture: ComponentFixture<IndexEcashEnabledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndexEcashEnabledComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexEcashEnabledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
