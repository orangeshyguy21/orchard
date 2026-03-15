/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Application Dependencies */
import {DeviceType} from '@client/modules/layout/types/device.types';
import {AiAgent} from '@client/modules/ai/classes/ai-agent.class';
import {AiModel} from '@client/modules/ai/classes/ai-model.class';
import {AiFavorites} from '@client/modules/cache/services/local-storage/local-storage.types';

@Component({
	selector: 'orc-settings-subsection-app-ai-agent',
	standalone: false,
	templateUrl: './settings-subsection-app-ai-agent.component.html',
	styleUrl: './settings-subsection-app-ai-agent.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionAppAiAgentComponent {
	/* ── Inputs ── */
	public agent = input<AiAgent | null>(null);
    public form_group = input<FormGroup | null>(null);
	public model = input<string | null>(null);
	public ai_models = input<AiModel[]>([]);
	public ai_favorites = input<AiFavorites>({ollama: [], openrouter: []});
	public ai_vendor = input<string>('ollama');
	public device_type = input<DeviceType>('desktop');
	public loading = input<boolean>(false);

	/* ── Outputs ── */
	public update = output<void>();
	public favoritesChange = output<AiFavorites>();

	/* *******************************************************
		Actions
	******************************************************** */

	/** Handles model selection from the model picker */
	public onModelChange(model: string): void {
		const form = this.form_group();
		if (!form) return;
		form.get('model')?.setValue(model);
		form.get('model')?.markAsDirty();
		this.update.emit();
	}

	/** Bubbles favorites change up to parent */
	public onFavoritesChange(favorites: AiFavorites): void {
		this.favoritesChange.emit(favorites);
	}
}
