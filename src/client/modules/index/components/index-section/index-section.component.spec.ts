import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexSectionComponent } from './index-section.component';

describe('IndexSectionComponent', () => {
  let component: IndexSectionComponent;
  let fixture: ComponentFixture<IndexSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndexSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
