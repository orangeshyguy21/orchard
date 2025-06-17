/* Core Dependencies */
import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
	selector: 'orc-bitcoin-subsection-disabled',
	standalone: false,
	templateUrl: './bitcoin-subsection-disabled.component.html',
	styleUrl: './bitcoin-subsection-disabled.component.scss',
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
export class BitcoinSubsectionDisabledComponent {

	public copy_animation_state: 'visible' | 'hidden' = 'hidden';

	private content: string;
	private copy_timeout: any;

	constructor(
		private cdr: ChangeDetectorRef
	) {
		this.content = '# Bitcoin .env sample\n';
		this.content += 'BITCOIN_TYPE=\'core\'\n';
		this.content += 'BITCOIN_RPC_HOST=\'localhost\'\n';
		this.content += 'BITCOIN_RPC_PORT=\'8332\'\n';
		this.content += 'BITCOIN_RPC_USER=\'rpcuser\'\n';
		this.content += 'BITCOIN_RPC_PASSWORD=\'rpcpass\'\n';
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
