/* Core Dependencies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
/* Vendor Dependencies */
// import QRCodeStyling, { Extension } from 'qr-code-styling';
import QRCodeStyling from 'qr-code-styling';
/* Native Dependencies */
import { MintInfo } from '@client/modules/mint/classes/mint-info.class';
/* Local Dependencies */
import { Connection } from './mint-connections.classes';

@Component({
	selector: 'orc-mint-connections',
	standalone: false,
	templateUrl: './mint-connections.component.html',
	styleUrl: './mint-connections.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintConnectionsComponent {

	@Input() urls: string[] | undefined;
	@Input() icon_url: string | undefined;
	@Input() time: number | undefined; // mint genesis time
	@Input() loading!: boolean;

	@ViewChild('qr_canvas', { static: true }) qr_canvas!: ElementRef;

	public qr_data: FormControl = new FormControl('tester');
	public qr_code!: QRCodeStyling;
	public connections: Connection[] = [];

	constructor(
		private changeDetectorRef: ChangeDetectorRef
	) {}

	ngOnChanges(changes: SimpleChanges): void {
		if( this.loading !== false ) return;
		this.init();
		this.initQR();
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
		const computed_style = getComputedStyle(document.documentElement);
		const primary_color = computed_style.getPropertyValue('--mat-sys-surface').trim() || '#BD022D';
		const inverse_tertiary_color = computed_style.getPropertyValue('--mat-sys-tertiary-container').trim() || '#BD022D';
		
		this.qr_code = new QRCodeStyling({
			width: 195,
			height: 195,
			type: 'svg',
			data: this.qr_data.value,
			image: this.icon_url,
			shape: 'square',
			margin: 0,
			qrOptions: {
			  typeNumber: 0,
			  mode: 'Byte',
			  errorCorrectionLevel: 'Q'
			},
			imageOptions: {
			  hideBackgroundDots: false,
			  imageSize: 0.3,
			  margin: 5,
			  crossOrigin: 'anonymous',
			},
			dotsOptions: {
			  color: primary_color,
			  type: 'extra-rounded'
			},
			backgroundOptions: {
				color: undefined,
			},
			cornersSquareOptions: {
			  color: primary_color,
			  type: 'extra-rounded',
			},
			cornersDotOptions: {
			  color: inverse_tertiary_color,
			  type: 'dot',
			}
		  });
	  
		  this.qr_code.append(this.qr_canvas.nativeElement);
	}

	private updateQRCode(): void {
		this.qr_code.update({
			data: this.qr_data.value
		});
	}

	public onSelectConnection(connection: Connection): void {
		this.qr_data.setValue(connection.url);
		this.updateQRCode();
	}
}