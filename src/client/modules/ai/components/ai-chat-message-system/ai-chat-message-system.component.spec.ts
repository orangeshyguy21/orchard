import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiChatMessageSystemComponent } from './ai-chat-message-system.component';

describe('AiChatMessageSystemComponent', () => {
  let component: AiChatMessageSystemComponent;
  let fixture: ComponentFixture<AiChatMessageSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AiChatMessageSystemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiChatMessageSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
