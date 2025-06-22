import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiChatMessageComponent } from './ai-chat-message.component';

describe('AiChatMessageComponent', () => {
  let component: AiChatMessageComponent;
  let fixture: ComponentFixture<AiChatMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AiChatMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiChatMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
