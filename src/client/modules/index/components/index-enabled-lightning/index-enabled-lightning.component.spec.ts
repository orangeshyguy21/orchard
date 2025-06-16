import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexEnabledLightningComponent } from './index-enabled-lightning.component';

describe('IndexEnabledLightningComponent', () => {
  let component: IndexEnabledLightningComponent;
  let fixture: ComponentFixture<IndexEnabledLightningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndexEnabledLightningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexEnabledLightningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
