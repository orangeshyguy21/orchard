import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexEnabledEcashComponent } from './index-enabled-ecash.component';

describe('IndexEnabledEcashComponent', () => {
  let component: IndexEnabledEcashComponent;
  let fixture: ComponentFixture<IndexEnabledEcashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndexEnabledEcashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexEnabledEcashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
