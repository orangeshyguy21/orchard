/* Core Dependencies */
import { ChangeDetectionStrategy, Component , Inject, ViewChild, ElementRef, OnInit } from '@angular/core';
/* Vendor Dependencies */
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import QRCodeStyling from 'qr-code-styling';
/* Application Dependencies */
import { ThemeService } from '@client/modules/settings/services/theme/theme.service';

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

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private themeService: ThemeService
	) {}

	ngOnInit(): void {
		this.initQR();
	}

	private initQR(): void {
		let themeless_primary_color = this.themeService.extractThemeColor(this.data.primary_color, 'dark');
		let themeless_corder_dot_color = this.themeService.extractThemeColor(this.data.corder_dot_color, 'dark');
		let themeless_bg = this.themeService.getThemeColor('--mat-sys-on-secondary-container', 'dark');

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
				color: themeless_corder_dot_color,
			 	type: 'square',
			}
		  });
	  
		this.qr_code.append(this.qr_canvas.nativeElement);
	}

	public download(): void {
		this.qr_code.download({ name: `${this.data.mint_name} QR`, extension: "png" });
	}

}