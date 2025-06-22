import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiChatLogComponent } from './ai-chat-log.component';

describe('AiChatLogComponent', () => {
  let component: AiChatLogComponent;
  let fixture: ComponentFixture<AiChatLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AiChatLogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiChatLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
