import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiNavComponent } from './ai-nav.component';

describe('AiNavComponent', () => {
  let component: AiNavComponent;
  let fixture: ComponentFixture<AiNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AiNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
