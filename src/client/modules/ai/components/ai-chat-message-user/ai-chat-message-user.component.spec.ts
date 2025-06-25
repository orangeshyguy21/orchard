import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiChatMessageUserComponent } from './ai-chat-message-user.component';

describe('AiChatMessageUserComponent', () => {
  let component: AiChatMessageUserComponent;
  let fixture: ComponentFixture<AiChatMessageUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AiChatMessageUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiChatMessageUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
