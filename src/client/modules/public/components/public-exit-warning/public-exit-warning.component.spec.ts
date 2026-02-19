import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicExitWarningComponent } from './public-exit-warning.component';

describe('PublicExitWarningComponent', () => {
  let component: PublicExitWarningComponent;
  let fixture: ComponentFixture<PublicExitWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicExitWarningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicExitWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
