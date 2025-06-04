/* Core Dependencies */
import { Injectable } from '@angular/core';
/* Application Dependencies */
import { ThemeService } from '@client/modules/settings/services/theme/theme.service';
import { ThemeType } from '@client/modules/cache/services/local-storage/local-storage.types';
/* Vendor Dependencies */
import QRCodeStyling, { DotType, CornerSquareType } from 'qr-code-styling';

@Injectable({
  	providedIn: 'root'
})
export class QrcodeService {

  	constructor(
		private themeService: ThemeService
	) { }

	getConfig({
		data,
		image = undefined,
	}: {
		data: string;
		image: string | undefined;
	}): QRCodeStyling {

		const qr_primary_color = this.themeService.getThemeColor('--mat-sys-surface') || '#000000';
		const qr_corner_dot_color = this.themeService.getThemeColor('--mat-sys-surface-container-highest') || '#000000';

		const config = {
			width: 195,
			height: 195,
			type: 'svg',
			data: data,
			image: image,
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
		}

		if(image) {
			config['imageOptions'] = {
				hideBackgroundDots: true,
				imageSize: 0.3,
				margin: 5,
				crossOrigin: 'anonymous',
			}
		}

		return new QRCodeStyling({
			width: 195,
			height: 195,
			type: 'svg',
			data: data,
			image: image,
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
	}
}
