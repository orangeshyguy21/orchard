/* Core Dependencies */
import {ChangeDetectionStrategy, Component, inject, input, output, signal, computed, viewChild, ElementRef} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Vendor Dependencies */
import {MatDialog} from '@angular/material/dialog';
/* Application Dependencies */
import {PublicExitWarningComponent} from '@client/modules/public/components/public-exit-warning/public-exit-warning.component';

@Component({
	selector: 'orc-settings-subsection-app-ai-messaging',
	standalone: false,
	templateUrl: './settings-subsection-app-ai-messaging.component.html',
	styleUrl: './settings-subsection-app-ai-messaging.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionAppAiMessagingComponent {
	private readonly dialog = inject(MatDialog);

	public form_group = input.required<FormGroup>();
	public invalid = input<boolean>(false);
	public dirty = input<boolean>(false);
	public setting_telegram_bot_token = input<string | null>(null);

	public update = output<void>();
	public cancel = output<string>();
	public submit = output<string>();

	public telegram_bot_token_control = viewChild<ElementRef<HTMLInputElement>>('telegram_bot_token_control');

	public help_status = signal<boolean>(false);
	public bot_help_status = signal<boolean>(true);
	public key_view = signal<boolean>(false);
	public focused = signal<boolean>(false);

	public hot = computed(() => {
		return this.focused() || this.dirty();
	});

	/* *******************************************************
		Actions
	******************************************************** */

	/** Toggles the AI enabled form control and emits an update */
	public toggleAIEnabled(status: boolean): void {
		this.form_group().get('enabled')?.setValue(status);
		this.form_group().get('enabled')?.markAsDirty();
		this.form_group().get('enabled')?.markAsTouched();
		this.update.emit();
	}

	public onCancel(event: Event): void {
		event.preventDefault();
		this.cancel.emit('telegram_bot_token');
	}

	public onSubmit(event: Event): void {
		event.preventDefault();
		const control = this.telegram_bot_token_control();
		if (control) control.nativeElement.blur();
		this.submit.emit('telegram_bot_token');
	}

	/** Opens the exit warning dialog for an external link */
	public onExternalLink(link: string): void {
		this.dialog.open(PublicExitWarningComponent, {data: {link}});
	}
}
