/* Core Dependencies */
import {ChangeDetectionStrategy, Component, computed, effect, ElementRef, input, output, viewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
/* Shared Dependencies */
import {AiAssistant} from '@shared/generated.types';

@Component({
	selector: 'orc-ai-input',
	standalone: false,
	templateUrl: './ai-input.component.html',
	styleUrl: './ai-input.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiInputComponent {
	public active_chat = input.required<boolean>();
	public active_assistant = input.required<AiAssistant>();
	public model = input.required<string | null>();
	public content = input.required<FormControl>();
	public focus = input<boolean>(false);

	public chat = output<void>();

	public input_el = viewChild<ElementRef<HTMLTextAreaElement>>('inputEl');

	public placeholder = computed(() => (this.active_chat() ? 'Generating...' : 'Message assistant...'));

	constructor() {
		effect(() => {
			const model = this.model();
			model ? this.content().enable() : this.content().disable();
		});

		effect(() => {
			if (this.focus()) {
				setTimeout(() => {
					this.input_el()?.nativeElement.focus();
				}, 100);
			}
		});
	}

	public onSubmit(event?: Event): void {
		if (event) event.preventDefault();
		this.chat.emit();
	}
}
