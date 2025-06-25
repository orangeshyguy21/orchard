import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiAgentDefinitionComponent } from './ai-agent-definition.component';

describe('AiAgentDefinitionComponent', () => {
  let component: AiAgentDefinitionComponent;
  let fixture: ComponentFixture<AiAgentDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AiAgentDefinitionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiAgentDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
