import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexHeaderLightningComponent } from './index-header-lightning.component';

describe('IndexHeaderLightningComponent', () => {
  let component: IndexHeaderLightningComponent;
  let fixture: ComponentFixture<IndexHeaderLightningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndexHeaderLightningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexHeaderLightningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
