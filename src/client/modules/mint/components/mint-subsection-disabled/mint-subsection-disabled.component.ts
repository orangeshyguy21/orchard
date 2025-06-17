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
	public type: string = 'cdk';
	
	private content: string;
	private copy_timeout: any;

	constructor(
		private cdr: ChangeDetectorRef
	) {
		this.content = this.getContent(this.type);
	}

	private getContent(type: string): string {
		if (type === 'nutshell') {
			let content = '# Mint .env sample\n';
			content += 'MINT_TYPE=\'nutshell\'\n';
			content += 'MINT_API=\'http://localhost:3888\'\n';
			content += 'MINT_DATABASE=\'/Path/to/database\'\n';
			return content;
		}else{
			let content = '# Mint .env sample\n';
			content += 'MINT_TYPE=\'cdk\'\n';
			content += 'MINT_API=\'http://localhost:5551\'\n';
			content += 'MINT_DATABASE=\'/Path/to/database\'\n';
			content += 'MINT_RPC_HOST=\'localhost\'\n';
			content += 'MINT_RPC_PORT=\'5552\'\n';
			content += 'MINT_RPC_KEY=\'/Path/to/client.key\'\n';
			content += 'MINT_RPC_CERT=\'/Path/to/client.pem\'\n';
			content += 'MINT_RPC_CA=\'/Path/to/ca.pem\'\n';
			return content;
		}
	}

	public onTypeChange(event: any): void {
		this.content
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