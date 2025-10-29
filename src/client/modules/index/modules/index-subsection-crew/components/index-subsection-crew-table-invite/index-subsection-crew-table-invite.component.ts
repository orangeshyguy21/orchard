/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, AfterViewInit, ViewChild, ElementRef, signal, computed} from '@angular/core';
/* Vendor Dependencies */
import QRCodeStyling from 'qr-code-styling';
/* Application Dependencies */
import {ThemeService} from '@client/modules/settings/services/theme/theme.service';
import {Invite} from '@client/modules/crew/classes/invite.class';

@Component({
	selector: 'orc-index-subsection-crew-table-invite',
	standalone: false,
	templateUrl: './index-subsection-crew-table-invite.component.html',
	styleUrl: './index-subsection-crew-table-invite.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSubsectionCrewTableInviteComponent implements AfterViewInit {
	@ViewChild('qr_canvas', {static: false}) qr_canvas!: ElementRef;

	public invite = input.required<Invite>();

	public show_copy_token = signal(false);
	public show_copy_url = signal(false);

	public invite_url = computed(() => {
		return `${window.location.origin}/authentication/invite/${this.invite().token}`;
	});

	public qr_code!: QRCodeStyling;

	private copy_timeout: any;

	constructor(private themeService: ThemeService) {}

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
			data: this.invite_url(),
			image: '/mint-icon-placeholder.png',
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

	public onCopyToken(): void {
		navigator.clipboard.writeText(this.invite().token);
		if (this.copy_timeout) clearTimeout(this.copy_timeout);
		this.show_copy_token.set(true);
		this.copy_timeout = setTimeout(() => {
			this.show_copy_token.set(false);
		}, 1000);
	}

	public onCopyUrl(): void {
		navigator.clipboard.writeText(this.invite_url());
		if (this.copy_timeout) clearTimeout(this.copy_timeout);
		this.show_copy_url.set(true);
		this.copy_timeout = setTimeout(() => {
			this.show_copy_url.set(false);
		}, 1000);
	}
}
