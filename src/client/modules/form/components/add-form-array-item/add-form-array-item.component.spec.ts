import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFormArrayItemComponent } from './add-form-array-item.component';

describe('AddFormArrayItemComponent', () => {
  let component: AddFormArrayItemComponent;
  let fixture: ComponentFixture<AddFormArrayItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddFormArrayItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFormArrayItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
