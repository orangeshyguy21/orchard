/* Core Dependencies */
import {ChangeDetectionStrategy, Component, ElementRef, input, computed, AfterViewInit, ViewChild, ChangeDetectorRef} from '@angular/core';
/* Vendor Dependencies */
import QRCodeStyling from 'qr-code-styling';
import {DateTime} from 'luxon';
/* Application Dependencies */
import {ThemeService} from '@client/modules/settings/services/theme/theme.service';
import {LightningRequest} from '@client/modules/lightning/classes/lightning-request.class';
/* Native Dependencies */
import {MintMintQuote} from '@client/modules/mint/classes/mint-mint-quote.class';
/* Shared Dependencies */
import {MintQuoteState} from '@shared/generated.types';

enum ExpiredState {
	NONE = 'None',
	PAID = 'PAID',
	EXPIRED = 'EXPIRED',
}

@Component({
	selector: 'orc-mint-subsection-database-table-mint',
	standalone: false,
	templateUrl: './mint-subsection-database-table-mint.component.html',
	styleUrl: './mint-subsection-database-table-mint.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionDatabaseTableMintComponent implements AfterViewInit {
	@ViewChild('qr_canvas', {static: false}) qr_canvas!: ElementRef;

	public quote = input.required<MintMintQuote>();
	public loading = input.required<boolean>();
	public lightning_request = input<LightningRequest | null>(null);

	public qr_code!: QRCodeStyling;
	public copy_animation_state: 'visible' | 'hidden' = 'hidden';

	private expired_state = computed((): ExpiredState => {
		const lr = this.lightning_request();
		const quote = this.quote();
		if (!lr) return ExpiredState.NONE;
		if (!lr.expiry) return ExpiredState.NONE;
		if (quote.state === MintQuoteState.Paid || quote.state === MintQuoteState.Issued) return ExpiredState.PAID;
		const now_seconds = DateTime.utc().toUnixInteger();
		if (quote.state === MintQuoteState.Unpaid && now_seconds > lr.expiry) return ExpiredState.EXPIRED;
		return ExpiredState.NONE;
	});

	public expired_message = computed(() => {
		const expired_state = this.expired_state();
		if (expired_state === ExpiredState.PAID) return 'Paid before expiry';
		if (expired_state === ExpiredState.EXPIRED) return 'Expired before paid';
		return '';
	});

	public expired_class = computed(() => {
		const expired_state = this.expired_state();
		if (expired_state === ExpiredState.PAID) return 'orc-outline-color';
		if (expired_state === ExpiredState.EXPIRED) return 'orc-status-warning-color';
		return '';
	});

	private copy_timeout: any;

	constructor(
		private themeService: ThemeService,
		private cdr: ChangeDetectorRef,
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
			data: this.quote().request,
			image: undefined,
			shape: 'square',
			margin: 0,
			qrOptions: {
				typeNumber: 0,
				mode: 'Byte',
				errorCorrectionLevel: 'Q',
			},
			dotsOptions: {
				color: qr_primary_color,
				type: 'extra-rounded',
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
			},
		});

		this.qr_code.append(this.qr_canvas.nativeElement);
	}

	public onCopy(value: string | null): void {
		if (!value) return;
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
