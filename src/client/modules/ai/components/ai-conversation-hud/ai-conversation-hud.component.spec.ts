import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiConversationHudComponent } from './ai-conversation-hud.component';

describe('AiConversationHudComponent', () => {
  let component: AiConversationHudComponent;
  let fixture: ComponentFixture<AiConversationHudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AiConversationHudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiConversationHudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
