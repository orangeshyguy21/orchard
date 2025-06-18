import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexDisabledEcashComponent } from './index-disabled-ecash.component';

describe('IndexDisabledEcashComponent', () => {
  let component: IndexDisabledEcashComponent;
  let fixture: ComponentFixture<IndexDisabledEcashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndexDisabledEcashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexDisabledEcashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
