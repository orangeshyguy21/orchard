import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiAgentComponent } from './ai-agent.component';

describe('AiAgentComponent', () => {
  let component: AiAgentComponent;
  let fixture: ComponentFixture<AiAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AiAgentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
