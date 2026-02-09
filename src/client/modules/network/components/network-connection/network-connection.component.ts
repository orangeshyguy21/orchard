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
/* Native Dependencies */
import {NetworkConnection} from '@client/modules/network/types/network-connection.type';

@Component({
	selector: 'orc-network-connection',
	standalone: false,
	templateUrl: './network-connection.component.html',
	styleUrl: './network-connection.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetworkConnectionComponent implements OnInit {
	private themeService = inject(ThemeService);
	public data = inject<NetworkConnection>(MAT_DIALOG_DATA);

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
			image: this.data.image,
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
			image: event.checked ? this.data.image : undefined,
		});
	}

	public download(): void {
		this.qr_code.download({name: `${this.data.name}_qr`, extension: 'png'});
	}
}
