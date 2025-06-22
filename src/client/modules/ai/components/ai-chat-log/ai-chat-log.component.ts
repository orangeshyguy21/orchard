import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'orc-ai-chat-log',
  standalone: false,
  templateUrl: './ai-chat-log.component.html',
  styleUrl: './ai-chat-log.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiChatLogComponent {

}
