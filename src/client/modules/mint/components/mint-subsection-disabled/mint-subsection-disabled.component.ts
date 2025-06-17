/* Core Dependencies */
import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
	selector: 'orc-mint-subsection-disabled',
	standalone: false,
	templateUrl: './mint-subsection-disabled.component.html',
	styleUrl: './mint-subsection-disabled.component.scss',
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
export class MintSubsectionDisabledComponent {

	public copy_animation_state: 'visible' | 'hidden' = 'hidden';
	public type: 'nutshell' | 'cdk' = 'cdk';
	public env_configs = {
		nutshell: {
			lines: [
				{ type: 'comment', value: '# Sample Mint .env' },
				{ type: 'variable', key: 'MINT_TYPE', value: 'nutshell' },
				{ type: 'variable', key: 'MINT_API', value: 'http://localhost:3888' },
				{ type: 'variable', key: 'MINT_DATABASE', value: '/path/to/database' }
			]
		},
		cdk: {
			lines: [
				{ type: 'comment', value: '# Sample Mint .env' },
				{ type: 'variable', key: 'MINT_TYPE', value: 'cdk' },
				{ type: 'variable', key: 'MINT_API', value: 'http://localhost:5551' },
				{ type: 'variable', key: 'MINT_DATABASE', value: '/path/to/database' },
				{ type: 'variable', key: 'MINT_RPC_HOST', value: 'localhost' },
				{ type: 'variable', key: 'MINT_RPC_PORT', value: '5552' },
				{ type: 'variable', key: 'MINT_RPC_KEY', value: '/path/to/client.key' },
				{ type: 'variable', key: 'MINT_RPC_CERT', value: '/path/to/client.pem' },
				{ type: 'variable', key: 'MINT_RPC_CA', value: '/path/to/ca.pem' }
			]
		}
	};

	public get env_config(): any {
		return this.env_configs[this.type];
	}
	
	private content: string;
	private copy_timeout: any;

	constructor(
		private cdr: ChangeDetectorRef
	) {
		this.content = this.getContent(this.type);
	}

	private getContent(type: 'nutshell' | 'cdk'): string {
		const config = this.env_configs[type];
		if (!config) return '';
		let content = '';
		config.lines.forEach(line => {
			if (line.type === 'comment') {
				content += `${line.value}\n`;
			} else if (line.type === 'variable') {
				content += `${line.key}='${line.value}'\n`;
			}
		});
		return content;
	}

	public onTypeChange(event: any): void {
		this.content = this.getContent(event.value);
	}

	public onCopy(): void {
		navigator.clipboard.writeText(this.content);
		if (this.copy_timeout) clearTimeout(this.copy_timeout);
		this.copy_animation_state = 'visible';
		this.cdr.detectChanges();
		this.copy_timeout = setTimeout(() => {
			this.copy_animation_state = 'hidden';
			this.cdr.detectChanges();
		}, 1000);	
	}
}