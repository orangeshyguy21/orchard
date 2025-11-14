/* Core Dependencies */
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
/* Vendor Dependencies */
import {DateTime} from 'luxon';
/* Application Dependencies */
import {SettingDeviceService} from '@client/modules/settings/services/setting-device/setting-device.service';
import {NonNullableBitcoinOracleSettings} from '@client/modules/settings/types/setting.types';
/* Native Dependencies */
import {BitcoinService} from '@client/modules/bitcoin/services/bitcoin/bitcoin.service';

@Component({
	selector: 'orc-bitcoin-subsection-oracle',
	standalone: false,
	templateUrl: './bitcoin-subsection-oracle.component.html',
	styleUrl: './bitcoin-subsection-oracle.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BitcoinSubsectionOracleComponent implements OnInit {
	public page_settings!: NonNullableBitcoinOracleSettings;
	public readonly control = new FormGroup({
		daterange: new FormGroup({
			date_start: new FormControl<DateTime | null>(null, [Validators.required]),
			date_end: new FormControl<DateTime | null>(null, [Validators.required]),
		}),
	});

	constructor(
		private bitcoinService: BitcoinService,
		private settingDeviceService: SettingDeviceService,
	) {}

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

	private getOracleData(): void {
		this.bitcoinService.getBitcoinOraclePriceRange(this.page_settings.date_start, this.page_settings.date_end).subscribe((data) => {
			console.log(data);
		});
	}
}
