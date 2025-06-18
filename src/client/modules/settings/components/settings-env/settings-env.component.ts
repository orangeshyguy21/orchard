/* Core Dependencies */
import { ChangeDetectionStrategy, Component, ChangeDetectorRef, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
/* Native Dependencies */
import { EnvConfig } from '@client/modules/settings/types/env.types';

@Component({
	selector: 'orc-settings-env',
	standalone: false,
	templateUrl: './settings-env.component.html',
	styleUrl: './settings-env.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('copyAnimation', [
			state('visible', style({
				opacity: 1,
				transform: 'translateY(0)'
			})),
			state('hidden', style({
				opacity: 0,
				transform: 'translateY(-0.5rem)'
			})),
			transition('hidden => visible', animate('100ms ease-out')),
			transition('visible => hidden', animate('100ms ease-in', style({ opacity: 0 })))
		])
	]
})
export class SettingsEnvComponent {

	@Input() env_config!: EnvConfig;

	public copy_animation_state: 'visible' | 'hidden' = 'hidden';

	private copy_timeout: any;

	constructor(
		private cdr: ChangeDetectorRef
	) {}

	private getContent(): string {
		if (!this.env_config) return '';
		let content = '';
		this.env_config.lines.forEach(line => {
			if (line.type === 'comment') {
				content += `${line.value}\n`;
			} else if (line.type === 'variable') {
				content += `${line.key}='${line.value}'\n`;
			}
		});
		return content;
	}

	public onCopy(): void {
		const content = this.getContent();
		navigator.clipboard.writeText(content);
		if (this.copy_timeout) clearTimeout(this.copy_timeout);
		this.copy_animation_state = 'visible';
		this.cdr.detectChanges();
		this.copy_timeout = setTimeout(() => {
			this.copy_animation_state = 'hidden';
			this.cdr.detectChanges();
		}, 1000);	
	}
}