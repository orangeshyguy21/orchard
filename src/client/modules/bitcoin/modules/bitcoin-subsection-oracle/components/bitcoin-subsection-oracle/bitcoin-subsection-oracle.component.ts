/* Core Dependencies */
import {ChangeDetectionStrategy, Component, OnInit, signal, ViewChild, ElementRef, HostListener} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
/* Vendor Dependencies */
import {DateTime} from 'luxon';
/* Application Dependencies */
import {SettingDeviceService} from '@client/modules/settings/services/setting-device/setting-device.service';
import {NonNullableBitcoinOracleSettings} from '@client/modules/settings/types/setting.types';
import {EventData} from '@client/modules/event/classes/event-data.class';
/* Native Dependencies */
import {BitcoinService} from '@client/modules/bitcoin/services/bitcoin/bitcoin.service';
import {BitcoinOraclePrice} from '@client/modules/bitcoin/classes/bitcoin-oracle-price.class';

@Component({
	selector: 'orc-bitcoin-subsection-oracle',
	standalone: false,
	templateUrl: './bitcoin-subsection-oracle.component.html',
	styleUrl: './bitcoin-subsection-oracle.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BitcoinSubsectionOracleComponent implements OnInit {
	@HostListener('window:beforeunload')
	canDeactivate(): boolean {
		return this.active_event?.type !== 'PENDING';
	}

	@ViewChild('backfill_form', {static: false}) backfill_form!: ElementRef;

	public page_settings!: NonNullableBitcoinOracleSettings;
	public readonly control = new FormGroup({
		daterange: new FormGroup({
			date_start: new FormControl<DateTime | null>(null, [Validators.required]),
			date_end: new FormControl<DateTime | null>(null, [Validators.required]),
		}),
	});
	public data = signal<BitcoinOraclePrice[]>([]);
	public loading = signal<boolean>(true);
	public form_open = signal<boolean>(false);

	private active_event: EventData | null = null;

	constructor(
		private bitcoinService: BitcoinService,
		private settingDeviceService: SettingDeviceService,
	) {}

	/* *******************************************************
	   Initalization                      
	******************************************************** */

	ngOnInit(): void {
		this.page_settings = this.getPageSettings();
		this.initializeControl();
		this.getOracleData();
	}

	private getPageSettings(): NonNullableBitcoinOracleSettings {
		const settings = this.settingDeviceService.getBitcoinOracleSettings();
		return {
			date_start: settings.date_start ?? Math.floor(DateTime.utc().minus({days: 14}).startOf('day').toSeconds()),
			date_end: settings.date_end ?? Math.floor(DateTime.utc().startOf('day').toSeconds()),
		};
	}

	private initializeControl(): void {
		const date_end_converted = DateTime.fromSeconds(this.page_settings.date_end, {zone: 'utc'});
		const date_start_converted = DateTime.fromSeconds(this.page_settings.date_start, {zone: 'utc'});
		this.control.get('daterange')?.get('date_start')?.setValue(date_start_converted);
		this.control.get('daterange')?.get('date_end')?.setValue(date_end_converted);
	}

	/* *******************************************************
	   Data              
	******************************************************** */

	private getOracleData(): void {
		this.bitcoinService.getBitcoinOraclePriceRange(this.page_settings.date_start, this.page_settings.date_end).subscribe({
			next: (data) => {
				this.data.set(data);
				this.loading.set(false);
			},
			error: (error) => {
				console.error('Error fetching oracle data:', error);
				this.loading.set(false);
				// Handle error appropriately (show notification, update UI, etc.)
			},
		});
	}

	/* *******************************************************
		Actions Up                     
	******************************************************** */

	public onBackfill(): void {
		!this.form_open() ? this.openBackfillForm() : this.onCloseBackfillForm();
	}

	/* *******************************************************
		Form                  
	******************************************************** */

	private openBackfillForm(): void {
		this.form_open.set(true);
	}

	private onCloseBackfillForm(): void {
		this.form_open.set(false);
	}
}
