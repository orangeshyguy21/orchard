/* Core Dependencies */
import {ChangeDetectionStrategy, Component, ElementRef, input, viewChild, effect, signal} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';
/* Vendor Dependencies */
import {firstValueFrom} from 'rxjs';
import QRCodeStyling from 'qr-code-styling';
import {MatDialog} from '@angular/material/dialog';
/* Application Dependencies */
import {ThemeService} from '@client/modules/settings/services/theme/theme.service';
import {PublicService} from '@client/modules/public/services/image/public.service';
import {PublicUrl} from '@client/modules/public/classes/public-url.class';
/* Native Dependencies */
import {MintSubsectionDashboardConnectionDialogComponent} from '../mint-subsection-dashboard-connection-dialog/mint-subsection-dashboard-connection-dialog.component';
/* Local Dependencies */
import {Connection} from './mint-subsection-dashboard-connections.classes';

@Component({
	selector: 'orc-mint-subsection-dashboard-connections',
	standalone: false,
	templateUrl: './mint-subsection-dashboard-connections.component.html',
	styleUrl: './mint-subsection-dashboard-connections.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class.flex-grow]': 'mobile_view()',
	},
})
export class MintSubsectionDashboardConnectionsComponent {
	public urls = input<string[] | null>(null);
	public icon_url = input<string | null>(null);
	public time = input<number | undefined>(undefined);
	public mint_name = input<string | undefined>(undefined);
	public loading = input.required<boolean>();
	public mint_connections = input.required<PublicUrl[]>();
	public mobile_view = input.required<boolean>();

	public qr_canvas = viewChild<ElementRef>('qr_canvas');

	public qr_data: FormControl = new FormControl('');
	public qr_code!: QRCodeStyling;

	public connections = signal<Connection[]>([]);
	public copy_animation_state = signal<'visible' | 'hidden'>('hidden');

	private copy_timeout: any;
	private qr_primary_color: string;
	private qr_corner_dot_color: string;
	private placeholder_icon_url: string = '/mint-icon-placeholder.png';
	private icon_data: string | undefined = undefined;

	constructor(
		private themeService: ThemeService,
		private publicService: PublicService,
		private dialog: MatDialog,
		private router: Router,
	) {
		this.qr_primary_color = this.themeService.getThemeColor('--mat-sys-surface') || '#000000';
		this.qr_corner_dot_color = this.themeService.getThemeColor('--mat-sys-surface-container-highest') || '#000000';

		effect(() => {
			if (this.loading() !== false) return;
			if (this.qr_code) return;
			this.init();
			this.initQR();
			this.loadImage();
		});
	}

	private init(): void {
		const urls = this.urls();
		if (!urls) return;
		this.connections.set(urls.map((url) => new Connection(url, this.getDisplayedUrl(url))) ?? []);
		if (this.connections().length > 0) this.qr_data.setValue(this.connections()[0].url);
	}

	private getDisplayedUrl(url: string): string {
		const last_dot_index = url.lastIndexOf('.');
		if (last_dot_index === -1) return url;
		const domain = url.substring(last_dot_index + 1);
		if (domain !== 'onion') return url;
		if (url.length < 56) return url; // v2 onion urls are shorter
		const VERIFICATION_LENGTH = 8;
		const protocol_match = url.match(/^(https?:\/\/)/);
		const protocol = protocol_match ? protocol_match[1] : '';
		const onion_address = url.replace(/^https?:\/\//, '');
		const start = onion_address.substring(0, VERIFICATION_LENGTH);
		const end = onion_address.substring(onion_address.length - VERIFICATION_LENGTH - 6); // -6 to account for ".onion"
		return `${protocol}${start}...${end}`;
	}

	private initQR(): void {
		if (this.connections().length === 0) return;

		this.qr_code = new QRCodeStyling({
			width: 195,
			height: 195,
			type: 'svg',
			data: this.qr_data.value,
			image: undefined,
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
				color: this.qr_primary_color,
				type: 'extra-rounded',
			},
			backgroundOptions: {
				color: undefined,
			},
			cornersSquareOptions: {
				color: this.qr_primary_color,
				type: 'extra-rounded',
			},
			cornersDotOptions: {
				color: this.qr_corner_dot_color,
				type: 'square',
			},
		});

		setTimeout(() => {
			this.qr_code.append(this.qr_canvas()?.nativeElement);
		});
	}

	private async loadImage(): Promise<void> {
		const icon_url = this.icon_url();
		if (!this.qr_code) return;
		if (!icon_url) {
			return this.qr_code.update({
				image: this.placeholder_icon_url,
			});
		}
		const image = await firstValueFrom(this.publicService.getPublicImageData(icon_url));
		this.icon_data = image?.data ?? undefined;
		this.qr_code.update({
			image: this.icon_data ?? undefined,
		});
	}

	private updateQRCode(): void {
		this.animateFade();
		setTimeout(() => {
			this.qr_code.update({
				data: this.qr_data.value,
			});
		}, 150);
	}

	private async animateFade(): Promise<void> {
		const qr_el = this.qr_canvas()?.nativeElement as HTMLElement;
		if (!qr_el || !this.qr_code) return;
		for (const anim of qr_el.getAnimations()) anim.cancel();
		const fade_out = qr_el.animate([{opacity: 1}, {opacity: 0}], {duration: 150, easing: 'ease-out', fill: 'forwards'});
		try {
			await fade_out.finished;
		} catch {}
		const fade_in = qr_el.animate([{opacity: 0}, {opacity: 1}], {duration: 150, easing: 'ease-in', fill: 'forwards'});
		try {
			await fade_in.finished;
		} catch {}
	}

	private showCopyMessage(): void {
		if (this.copy_timeout) clearTimeout(this.copy_timeout);
		this.copy_animation_state.set('visible');
		this.copy_timeout = setTimeout(() => {
			this.copy_animation_state.set('hidden');
		}, 1000);
	}

	public onSelectConnection(connection: Connection): void {
		this.qr_data.setValue(connection.url);
		navigator.clipboard.writeText(connection.url);
		this.updateQRCode();
		this.showCopyMessage();
	}

	public onQRClick(): void {
		this.dialog.open(MintSubsectionDashboardConnectionDialogComponent, {
			data: {
				connection: this.connections().find((connection) => connection.url === this.qr_data.value),
				primary_color: this.qr_primary_color,
				corner_dot_color: this.qr_corner_dot_color,
				icon_data: this.icon_data ?? this.placeholder_icon_url,
				mint_name: this.mint_name,
			},
		});
	}

	public onAddConnection(): void {
		this.router.navigate(['mint', 'info']);
	}
}
