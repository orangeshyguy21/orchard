import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexHeaderEcashComponent } from './index-header-ecash.component';

describe('IndexHeaderEcashComponent', () => {
  let component: IndexHeaderEcashComponent;
  let fixture: ComponentFixture<IndexHeaderEcashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndexHeaderEcashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexHeaderEcashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
