/* Core Dependencies */
import {ChangeDetectionStrategy, Component, DestroyRef, input, output, inject, effect, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormGroup} from '@angular/forms';
/* Application Dependencies */
import {AiService} from '@client/modules/ai/services/ai/ai.service';
import {DeviceType} from '@client/modules/layout/types/device.types';
import {AiHealth} from '@client/modules/ai/classes/ai-health.class';

@Component({
	selector: 'orc-settings-subsection-app-ai',
	standalone: false,
	templateUrl: './settings-subsection-app-ai.component.html',
	styleUrl: './settings-subsection-app-ai.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionAppAiComponent {
	private readonly aiService = inject(AiService);
	private readonly destroyRef = inject(DestroyRef);

	public ai_enabled = input.required<boolean>();
	public form_group = input.required<FormGroup>();
	public device_type = input.required<DeviceType>();

	public update = output<void>();
	public submit = output<string>();
	public cancel = output<string>();

	public ai_health = signal<AiHealth | null>(null);

	constructor() {
		effect(() => {
			const ai_enabled = this.ai_enabled();
			if (ai_enabled) this.getAiHealth();
		});
	}

	private getAiHealth(): void {
		this.aiService
			.getAiHealth()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (health: AiHealth) => {
					this.ai_health.set(health);
				},
			});
	}
}
