import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexLightningInfoComponent } from './index-lightning-info.component';

describe('IndexLightningInfoComponent', () => {
  let component: IndexLightningInfoComponent;
  let fixture: ComponentFixture<IndexLightningInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndexLightningInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexLightningInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
