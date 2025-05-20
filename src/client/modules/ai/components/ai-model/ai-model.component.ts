import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'orc-ai-model',
  standalone: false,
  templateUrl: './ai-model.component.html',
  styleUrl: './ai-model.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiModelComponent {

	@Input() model!: string | null;

	@Output() modelChange = new EventEmitter<string>();

}
