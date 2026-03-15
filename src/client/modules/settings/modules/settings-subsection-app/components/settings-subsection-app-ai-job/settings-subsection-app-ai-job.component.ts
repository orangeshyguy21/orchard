/* Core Dependencies */
import {ChangeDetectionStrategy, Component, computed, input, output} from '@angular/core';
/* Vendor Dependencies */
import {CronJob} from 'cron';
import {DateTime} from 'luxon';
/* Native Dependencies */
import {AiAgent} from '@client/modules/ai/classes/ai-agent.class';
import {AiModel} from '@client/modules/ai/classes/ai-model.class';
import {AiFavorites} from '@client/modules/cache/services/local-storage/local-storage.types';
import {DeviceType} from '@client/modules/layout/types/device.types';
import {FormGroup} from '@angular/forms';
import {ToolSummary} from '@client/modules/settings/modules/settings-subsection-app/types/settings-subsection-app.types';

@Component({
	selector: 'orc-settings-subsection-app-ai-job',
	standalone: false,
	templateUrl: './settings-subsection-app-ai-job.component.html',
	styleUrl: './settings-subsection-app-ai-job.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionAppAiJobComponent {
    /* ── Inputs ── */
    public agent = input<AiAgent | null>(null);
    public tools = input<ToolSummary[]>([]);
    public form_group = input<FormGroup | null>(null);
    public model = input<string | null>(null);
    public active = input<boolean>(false);
    public ai_models = input<AiModel[]>([]);
    public ai_favorites = input<AiFavorites>({ollama: [], openrouter: []});
    public ai_vendor = input<string>('ollama');
    public device_type = input<DeviceType>('desktop');
    public loading = input<boolean>(false);

    /* ── Public computed signals ── */

    /** Calculates the nearest next run time across all agent schedules */
    public readonly next_run = computed<DateTime | null>(() => {
        const schedules = this.agent()?.schedules ?? [];
        return schedules
            .map((expr) => { try { return new CronJob(expr, () => {}).nextDate(); } catch { return null; } })
            .filter((d): d is DateTime => d !== null)
            .reduce<DateTime | null>((earliest, d) => (!earliest || d < earliest ? d : earliest), null);
    });

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

    /** Toggles the AI enabled form control and emits an update */
	public onEnabledChange(status: boolean): void {
        const form = this.form_group();
		if (!form) return;
		form.get('active')?.setValue(status);
		form.get('active')?.markAsDirty();
		form.get('active')?.markAsTouched();
        console.log('onEnabledChange', status);
		this.update.emit();
	}
}
