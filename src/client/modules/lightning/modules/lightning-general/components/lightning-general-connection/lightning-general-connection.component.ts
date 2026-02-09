/* Core Dependencies */
import {ChangeDetectionStrategy, Component, inject, viewChild, ElementRef, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
/* Vendor Dependencies */
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import QRCodeStyling, {DotType, CornerSquareType} from 'qr-code-styling';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
/* Application Dependencies */
import {ThemeService} from '@client/modules/settings/services/theme/theme.service';
import {ThemeType} from '@client/modules/cache/services/local-storage/local-storage.types';
import {DeviceType} from '@client/modules/layout/types/device.types';

@Component({
	selector: 'orc-lightning-general-connection',
	standalone: false,
	templateUrl: './lightning-general-connection.component.html',
	styleUrl: './lightning-general-connection.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LightningGeneralConnectionComponent implements OnInit {
	private themeService = inject(ThemeService);
	public data = inject<{
		uri: string;
		type: string;
		label: string;
		color: string;
		name: string;
		device_type: DeviceType;
	}>(MAT_DIALOG_DATA);

	public qr_canvas = viewChild<ElementRef>('qr_canvas');

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

	ngOnInit(): void {
		this.initQR();
	}

	private initQR(): void {
		const qr_primary_color = this.themeService.getThemeColor('--mat-sys-surface') || '#000000';
		const qr_corner_dot_color = this.themeService.getThemeColor('--mat-sys-surface-container-highest') || '#000000';
		const themeless_primary_color = this.themeService.extractThemeColor(qr_primary_color, ThemeType.DARK_MODE);
		const themeless_corner_dot_color = this.themeService.extractThemeColor(qr_corner_dot_color, ThemeType.DARK_MODE);
		const themeless_bg = this.themeService.getThemeColor('--mat-sys-on-secondary-container', ThemeType.DARK_MODE);
		const size = this.data.device_type === 'mobile' ? 295 : 395;

		this.qr_code = new QRCodeStyling({
			width: size,
			height: size,
			type: 'svg',
			data: this.data.uri,
			image: this.createCircleSvg(this.data.color),
			shape: 'square',
			margin: 0,
			qrOptions: {
				typeNumber: 0,
				mode: 'Byte',
				errorCorrectionLevel: 'Q',
			},
			imageOptions: {
				hideBackgroundDots: true,
				imageSize: 0.3,
				margin: 5,
				crossOrigin: 'anonymous',
			},
			dotsOptions: {
				color: themeless_primary_color,
				type: 'extra-rounded',
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
			},
		});

		this.qr_code.append(this.qr_canvas()?.nativeElement);
	}

	public onStyleChange(): void {
		if (this.qr_options.value.style === null || this.qr_options.value.style === undefined) return;
		const style_value = this.qr_options.value.style;
		this.qr_code.update({
			dotsOptions: {
				type: this.dot_options[style_value],
			},
			cornersSquareOptions: {
				type: this.corner_squre_options[style_value],
			},
		});
	}

	public onImageChange(event: MatSlideToggleChange): void {
		if (this.qr_options.value.image === null || this.qr_options.value.image === undefined) return;
		this.qr_code.update({
			image: event.checked ? this.createCircleSvg(this.data.color) : undefined,
		});
	}

	/** Creates an SVG circle data URI for use as a QR code center image */
	private createCircleSvg(color: string): string {
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="${color}"/></svg>`;
		return `data:image/svg+xml;base64,${btoa(svg)}`;
	}

	public download(): void {
		this.qr_code.download({name: `${this.data.name} QR`, extension: 'png'});
	}
}
