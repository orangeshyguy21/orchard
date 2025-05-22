import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiCommandComponent } from './ai-command.component';

describe('AiCommandComponent', () => {
  let component: AiCommandComponent;
  let fixture: ComponentFixture<AiCommandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AiCommandComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
