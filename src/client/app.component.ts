/* Core Dependencies */
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
/* Vendor Dependencies */
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
/* Application Dependencies */
import { SettingService } from '@client/modules/settings/services/setting/setting.service';

@Component({
	selector: 'orc-root',
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: false,
})
export class AppComponent implements OnInit {
	constructor(
		private matIconRegistry: MatIconRegistry,
		private domSanitizer: DomSanitizer,
		private settingService: SettingService,
	) { }

	ngOnInit(): void {
		this.initIcons();
		this.initSettings();
	}

	private initIcons(): void {
		this.matIconRegistry
			.setDefaultFontSetClass('mat-symbol');
		
		this.matIconRegistry
			.addSvgIcon('bitcoin', this.domSanitizer.bypassSecurityTrustResourceUrl('icon/bitcoin.svg'))
			.addSvgIcon('bitcoin_outline', this.domSanitizer.bypassSecurityTrustResourceUrl('icon/bitcoin-outline.svg'))
			.addSvgIcon('tor', this.domSanitizer.bypassSecurityTrustResourceUrl('icon/tor.svg'))
			.addSvgIcon('nostr', this.domSanitizer.bypassSecurityTrustResourceUrl('icon/nostr.svg'))
			.addSvgIcon('x', this.domSanitizer.bypassSecurityTrustResourceUrl('icon/x.svg'));
	}

	private initSettings(): void {
		this.settingService.init();
	}
}
