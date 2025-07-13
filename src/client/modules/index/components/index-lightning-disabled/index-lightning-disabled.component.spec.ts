import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexLightningDisabledComponent } from './index-lightning-disabled.component';

describe('IndexLightningDisabledComponent', () => {
  let component: IndexLightningDisabledComponent;
  let fixture: ComponentFixture<IndexLightningDisabledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndexLightningDisabledComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexLightningDisabledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
