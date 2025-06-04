/* Core Dependencies */
import { ChangeDetectionStrategy, Component, ElementRef, Input, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
/* Vendor Dependencies */
import QRCodeStyling from 'qr-code-styling';
/* Application Dependencies */
import { ThemeService } from '@client/modules/settings/services/theme/theme.service';
/* Native Dependencies */
import { MintMeltQuote } from '@client/modules/mint/classes/mint-melt-quote.class';

@Component({
	selector: 'orc-mint-data-melt',
	standalone: false,
	templateUrl: './mint-data-melt.component.html',
	styleUrl: './mint-data-melt.component.scss',
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
export class MintDataMeltComponent implements AfterViewInit {

	@ViewChild('qr_canvas', { static: false }) qr_canvas!: ElementRef;

	@Input() quote!: MintMeltQuote;

	public qr_code!: QRCodeStyling;
	public copy_animation_state: 'visible' | 'hidden' = 'hidden';
	private copy_timeout: any;

	constructor(
		private themeService: ThemeService,
		private cdr: ChangeDetectorRef
	) {}

	ngAfterViewInit(): void {
		this.initQR();
	}

	private initQR(): void {
		const qr_primary_color = this.themeService.getThemeColor('--mat-sys-surface') || '#000000';
		const qr_corner_dot_color = this.themeService.getThemeColor('--mat-sys-surface-container-highest') || '#000000';

		this.qr_code = new QRCodeStyling({
			width: 195,
			height: 195,
			type: 'svg',
			data: this.quote.request,
			image: undefined,
			shape: 'square',
			margin: 0,
			qrOptions: {
				typeNumber: 0,
				mode: 'Byte',
				errorCorrectionLevel: 'Q'
			},
			dotsOptions: {
				color: qr_primary_color,
				type: 'extra-rounded'
			},
			backgroundOptions: {
				color: undefined,
			},
			cornersSquareOptions: {
				color: qr_primary_color,
				type: 'extra-rounded',
			},
			cornersDotOptions: {
				color: qr_corner_dot_color,
			 	type: 'square',
			}
		  });
	  
		  this.qr_code.append(this.qr_canvas.nativeElement);
	}

	public onCopy(value:string): void {
		navigator.clipboard.writeText(value);
		if (this.copy_timeout) clearTimeout(this.copy_timeout);
		this.copy_animation_state = 'visible';
		this.cdr.detectChanges();
		this.copy_timeout = setTimeout(() => {
			this.copy_animation_state = 'hidden';
			this.cdr.detectChanges();
		}, 1000);		
	}
}