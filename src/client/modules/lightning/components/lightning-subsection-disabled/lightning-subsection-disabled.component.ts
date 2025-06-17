/* Core Dependencies */
import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'orc-lightning-subsection-disabled',
  standalone: false,
  templateUrl: './lightning-subsection-disabled.component.html',
  styleUrl: './lightning-subsection-disabled.component.scss',
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
export class LightningSubsectionDisabledComponent {

	public copy_animation_state_lightning: 'visible' | 'hidden' = 'hidden';
	public copy_animation_state_taproot_assets: 'visible' | 'hidden' = 'hidden';

	private content_lightning: string;
	private content_taproot_assets: string;
	private copy_timeout_lightning: any;
	private copy_timeout_taproot_assets: any;

	constructor(
		private cdr: ChangeDetectorRef
	) {
		this.content_lightning = '# Lightning .env sample\n';
		this.content_lightning += 'LIGHTNING_TYPE=\'lnd\'\n';
		this.content_lightning += 'LIGHTNING_RPC_HOST=\'localhost\'\n';
		this.content_lightning += 'LIGHTNING_RPC_PORT=\'8447\'\n';
		this.content_lightning += 'LIGHTNING_MACAROON=\'path/to/macaroon\'\n';
		this.content_lightning += 'LIGHTNING_CERT=\'path/to/cert\'\n';

		this.content_taproot_assets = '# Taproot Assets .env sample\n';
		this.content_taproot_assets += 'TAPROOT_ASSETS_TYPE=\'tapd\'\n';
		this.content_taproot_assets += 'TAPROOT_ASSETS_RPC_HOST=\'localhost\'\n';
		this.content_taproot_assets += 'TAPROOT_ASSETS_RPC_PORT=\'8447\'\n';
		this.content_taproot_assets += 'TAPROOT_ASSETS_MACAROON=\'path/to/macaroon\'\n';
		this.content_taproot_assets += 'TAPROOT_ASSETS_CERT=\'path/to/cert\'\n';
	}

	public onCopyLightning(): void {
		navigator.clipboard.writeText(this.content_lightning);
		if (this.copy_timeout_lightning) clearTimeout(this.copy_timeout_lightning);
		this.copy_animation_state_lightning = 'visible';
		this.cdr.detectChanges();
		this.copy_timeout_lightning = setTimeout(() => {
			this.copy_animation_state_lightning = 'hidden';
			this.cdr.detectChanges();
		}, 1000);	
	}

	public onCopyTaprootAssets(): void {
		navigator.clipboard.writeText(this.content_taproot_assets);
		if (this.copy_timeout_taproot_assets) clearTimeout(this.copy_timeout_taproot_assets);
		this.copy_animation_state_taproot_assets = 'visible';
		this.cdr.detectChanges();
		this.copy_timeout_taproot_assets = setTimeout(() => {
			this.copy_animation_state_taproot_assets = 'hidden';
			this.cdr.detectChanges();
		}, 1000);	
	}
}
