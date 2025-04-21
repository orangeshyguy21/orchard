/* Core Dependencies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
/* Vendor Dependencies */
import { firstValueFrom } from 'rxjs';
import QRCodeStyling from 'qr-code-styling';
import { MatDialog } from '@angular/material/dialog';
/* Application Dependencies */
import { ThemeService } from '@client/modules/settings/services/theme/theme.service';
import { ImageService } from '@client/modules/image/services/image/image.service';
/* Native Dependencies */
import { MintQrcodeDialogComponent } from '../mint-qrcode-dialog/mint-qrcode-dialog.component';
/* Local Dependencies */
import { Connection } from './mint-connections.classes';

@Component({
	selector: 'orc-mint-connections',
	standalone: false,
	templateUrl: './mint-connections.component.html',
	styleUrl: './mint-connections.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('fadeInOut', [
			state('visible', style({
				opacity: 1
			})),
			state('hidden', style({
				opacity: 0
			})),
			transition('visible => hidden', animate('150ms ease-out')),
			transition('hidden => visible', animate('150ms ease-in'))
		]),
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
export class MintConnectionsComponent {

	@Input() urls!: string[] | null;
	@Input() icon_url!: string | null;
	@Input() time: number | undefined;
	@Input() mint_name: string | undefined;
	@Input() loading!: boolean;

	@ViewChild('qr_canvas', { static: false }) qr_canvas!: ElementRef;

	public qr_data: FormControl = new FormControl('tester');
	public qr_code!: QRCodeStyling;
	public connections: Connection[] = [];
	public qr_animation_state: 'visible' | 'hidden' = 'visible';
	public copy_animation_state: 'visible' | 'hidden' = 'hidden';

	private copy_timeout: any;
	private qr_primary_color: string;
	private qr_corner_dot_color: string;
	private placeholder_icon_url: string = '/mint-icon-placeholder.png';
	private icon_data: string | undefined = undefined;

	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private themeService: ThemeService,
		private imageService: ImageService,
		private dialog: MatDialog,
		private router: Router
	) {
		this.qr_primary_color = this.themeService.getThemeColor('--mat-sys-surface') || '#000000';
		this.qr_corner_dot_color = this.themeService.getThemeColor('--mat-sys-surface-container-highest') || '#000000';
	}

	ngOnChanges(changes: SimpleChanges): void {
		if( this.loading !== false ) return;
		this.init();
		this.initQR();
		this.loadImage();
	}

	private init(): void {
		this.connections = this.urls?.map(url => new Connection(url, this.getDisplayedUrl(url))) ?? [];
		if( this.connections.length > 0 ) this.qr_data.setValue(this.connections[0].url);
		this.changeDetectorRef.detectChanges();
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
		if( this.connections.length === 0 ) return;
		// const icon_url = this.icon_url || this.placeholder_icon_url;

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
				errorCorrectionLevel: 'Q'
			},
			imageOptions: {
				hideBackgroundDots: true,
				imageSize: 0.3,
				margin: 5,
				crossOrigin: 'anonymous',
			},
			dotsOptions: {
				color: this.qr_primary_color,
				type: 'extra-rounded'
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
			}
		  });
	  
		  this.qr_code.append(this.qr_canvas.nativeElement);
	}

	private async loadImage(): Promise<void> {
		if( !this.icon_url ) return;
		const image = await firstValueFrom(this.imageService.getImageData(this.icon_url));
		this.icon_data = image?.data ?? undefined;
		this.qr_code.update({
			image: this.icon_data ?? undefined,
		});
	}

	private updateQRCode(): void {
		this.qr_animation_state = 'hidden';
		this.changeDetectorRef.detectChanges();
		
		setTimeout(() => {
			this.qr_code.update({
				data: this.qr_data.value
			});
			this.qr_animation_state = 'visible';
			this.changeDetectorRef.detectChanges();
		}, 150);
	}

	// maybe two methods for this?
	public onSelectConnection(connection: Connection): void {
		this.qr_data.setValue(connection.url);
		navigator.clipboard.writeText(connection.url);
		this.updateQRCode();

		if (this.copy_timeout) clearTimeout(this.copy_timeout);
		this.copy_animation_state = 'visible';
		this.changeDetectorRef.detectChanges();
		this.copy_timeout = setTimeout(() => {
			this.copy_animation_state = 'hidden';
			this.changeDetectorRef.detectChanges();
		}, 1000);		
	}

	public onQRClick(): void {
		this.dialog.open(MintQrcodeDialogComponent, {
			data: {
				connection: this.connections.find(connection => connection.url === this.qr_data.value),
				primary_color: this.qr_primary_color,
				corner_dot_color: this.qr_corner_dot_color,
				icon_data: this.icon_data ?? this.placeholder_icon_url,
				mint_name: this.mint_name
			}
		});
	}

	public onAddConnection(): void {
		this.router.navigate(['mint', 'info']);
	}
}