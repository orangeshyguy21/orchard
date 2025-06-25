import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiChatMessageToolcallComponent } from './ai-chat-message-toolcall.component';

describe('AiChatMessageToolcallComponent', () => {
  let component: AiChatMessageToolcallComponent;
  let fixture: ComponentFixture<AiChatMessageToolcallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AiChatMessageToolcallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiChatMessageToolcallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
