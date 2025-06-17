import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexDisabledLightningComponent } from './index-disabled-lightning.component';

describe('IndexDisabledLightningComponent', () => {
  let component: IndexDisabledLightningComponent;
  let fixture: ComponentFixture<IndexDisabledLightningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndexDisabledLightningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexDisabledLightningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
