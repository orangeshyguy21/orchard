import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcashSectionComponent } from './ecash-section.component';

describe('EcashSectionComponent', () => {
  let component: EcashSectionComponent;
  let fixture: ComponentFixture<EcashSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EcashSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EcashSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
