import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LightningSectionComponent } from './lightning-section.component';

describe('LightningSectionComponent', () => {
  let component: LightningSectionComponent;
  let fixture: ComponentFixture<LightningSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LightningSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LightningSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
