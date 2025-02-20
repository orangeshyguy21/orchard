/* Core Dependencies */
import { Component, ChangeDetectionStrategy } from '@angular/core';
/* Vendor Dependencies */
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'orc-root',
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: false,
})
export class AppComponent {
	constructor(
		private matIconRegistry: MatIconRegistry,
		private domSanitizer: DomSanitizer
	) {
		this.matIconRegistry.setDefaultFontSetClass('mat-symbol');
		
		// Register bitcoin icon
		this.matIconRegistry
			.addSvgIcon('bitcoin', this.domSanitizer.bypassSecurityTrustResourceUrl('icon/bitcoin.svg'))
			.addSvgIcon('bitcoin_outline', this.domSanitizer.bypassSecurityTrustResourceUrl('icon/bitcoin-outline.svg'))

	}
}
