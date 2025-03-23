import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorResolveComponent } from './error-resolve.component';

describe('ErrorResolveComponent', () => {
  let component: ErrorResolveComponent;
  let fixture: ComponentFixture<ErrorResolveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorResolveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorResolveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
