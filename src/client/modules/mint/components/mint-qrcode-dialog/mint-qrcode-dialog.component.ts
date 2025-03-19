/* Core Dependencies */
import { ChangeDetectionStrategy, Component , Inject, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
/* Vendor Dependencies */
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import QRCodeStyling, { DotType, CornerSquareType } from 'qr-code-styling';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
/* Application Dependencies */
import { ThemeService } from '@client/modules/settings/services/theme/theme.service';
import { ThemeType } from '@client/modules/cache/services/local-storage/local-storage.types';


@Component({
	selector: 'orc-mint-qrcode-dialog',
	standalone: false,
	templateUrl: './mint-qrcode-dialog.component.html',
	styleUrl: './mint-qrcode-dialog.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintQrcodeDialogComponent implements OnInit {

	@ViewChild('qr_canvas', { static: true }) qr_canvas!: ElementRef;

	public qr_code!: QRCodeStyling;

	public readonly qr_options = new FormGroup({
		style: new FormControl<string | null>('0', [Validators.required]),
		image: new FormControl<boolean | null>(true, [Validators.required]),
	});

	private readonly corner_squre_options: Record<string, CornerSquareType> = {
		'0': 'extra-rounded',
		'1': 'extra-rounded',
		'2': 'square',
		'3': 'square',
	};
	private readonly dot_options: Record<string, DotType> = {
		'0': 'extra-rounded',
		'1': 'rounded',
		'2': 'classy',
		'3': 'square',
	};

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private themeService: ThemeService
	) {}

	ngOnInit(): void {
		this.initQR();
	}

	private initQR(): void {
		let themeless_primary_color = this.themeService.extractThemeColor(this.data.primary_color, ThemeType.DARK_MODE);
		let themeless_corner_dot_color = this.themeService.extractThemeColor(this.data.corner_dot_color, ThemeType.DARK_MODE);
		let themeless_bg = this.themeService.getThemeColor('--mat-sys-on-secondary-container', ThemeType.DARK_MODE);

		this.qr_code = new QRCodeStyling({
			width: 395,
			height: 395,
			type: 'svg',
			data: this.data.connection.url,
			image: this.data.icon_url,
			shape: 'square',
			margin: 0,
			qrOptions: {
				typeNumber: 0,
				mode: 'Byte',
				errorCorrectionLevel: 'Q'
			},
			imageOptions: {
				hideBackgroundDots: true,
				imageSize: 0.3,
				margin: 5,
				crossOrigin: 'anonymous',
			},
			dotsOptions: {
				color: themeless_primary_color,
				type: 'extra-rounded'
			},
			backgroundOptions: {
				color: themeless_bg,
			},
			cornersSquareOptions: {
				color: themeless_primary_color,
				type: 'extra-rounded',
			},
			cornersDotOptions: {
				color: themeless_corner_dot_color,
			 	type: 'square',
			}
		  });
	  
		this.qr_code.append(this.qr_canvas.nativeElement);
	}

	public onStyleChange(event: Event): void {
		if (this.qr_options.value.style === null || this.qr_options.value.style === undefined) return;
		const style_value = this.qr_options.value.style;
		this.qr_code.update({
			dotsOptions: {
				type: this.dot_options[style_value]
			},
			cornersSquareOptions: {
				type: this.corner_squre_options[style_value]
			}
		});
	}

	public onImageChange(event: MatSlideToggleChange): void {
		console.log(event);
		if( this.qr_options.value.image === null || this.qr_options.value.image === undefined ) return;
		this.qr_code.update({
			image: event.checked ? this.data.icon_url : null
		});
	}

	public download(): void {
		this.qr_code.download({ name: `${this.data.mint_name} QR`, extension: "png" });
	}
}