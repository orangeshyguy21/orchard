/* Core Dependencies */
import {ChangeDetectionStrategy, Component, OnInit, OnDestroy, inject, input, output, signal} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Vendor Dependencies */
import {DateTime} from 'luxon';
import {Subscription, firstValueFrom} from 'rxjs';
/* Application Dependencies */
import {BitcoinService} from '@client/modules/bitcoin/services/bitcoin/bitcoin.service';
import {BitcoinOraclePrice} from '@client/modules/bitcoin/classes/bitcoin-oracle-price.class';
import {DeviceType} from '@client/modules/layout/types/device.types';
/* Shared Dependencies */
import {UtxOracleProgressStatus} from '@shared/generated.types';

@Component({
	selector: 'orc-settings-subsection-app-bitcoin',
	standalone: false,
	templateUrl: './settings-subsection-app-bitcoin.component.html',
	styleUrl: './settings-subsection-app-bitcoin.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionAppBitcoinComponent implements OnInit, OnDestroy {
	private readonly bitcoinService = inject(BitcoinService);

	public bitcoin_enabled = input.required<boolean>();
	public bitcoin_oracle_enabled = input.required<boolean>();
	public form_group = input.required<FormGroup>();
	public device_type = input.required<DeviceType>();

	public update_oracle = output<void>();

	public bitcoin_oracle_price = signal<BitcoinOraclePrice | null>(null);
	public oracle_running = signal<boolean>(false);
	public oracle_progress = signal<number>(0);
	public oracle_status = signal<UtxOracleProgressStatus | null>(null);

	private subscriptions = new Subscription();

	ngOnInit(): void {
		this.getBitcoinOracle();
		this.subscriptions.add(this.getBackfillProgressSubscription());
		this.subscriptions.add(this.getBackfillActiveSubscription());
	}

	/* *******************************************************
		Data
	******************************************************** */

	/** Fetches the latest oracle price from the server */
	public async getBitcoinOracle(): Promise<void> {
		const bitcoin_oracle_price = await firstValueFrom(this.bitcoinService.loadBitcoinOraclePrice());
		this.bitcoin_oracle_price.set(bitcoin_oracle_price);
	}

	/* *******************************************************
		Actions Up
	******************************************************** */

	/** Runs the oracle for the most recent applicable day */
	public onOracleAsked(): void {
		if (this.oracle_running()) return;
		const yesterday = Math.floor(DateTime.utc().minus({days: 1}).startOf('day').toSeconds());
		this.oracle_running.set(true);
		this.oracle_progress.set(0);
		this.oracle_status.set(null);
		this.bitcoinService.openBackfillSocket(yesterday);
	}

	/* *******************************************************
		Subscriptions
	******************************************************** */

	/** Subscribes to backfill progress updates */
	private getBackfillProgressSubscription(): Subscription {
		return this.bitcoinService.backfill_progress$.subscribe((progress) => {
			this.oracle_status.set(progress.status);
			this.oracle_progress.set(progress.overall_progress ?? 0);
			if (progress.status === UtxOracleProgressStatus.Completed) {
				this.getBitcoinOracle();
			}
		});
	}

	/** Subscribes to backfill active state */
	private getBackfillActiveSubscription(): Subscription {
		return this.bitcoinService.backfill_active$.subscribe((active) => {
			this.oracle_running.set(active);
		});
	}

	/* *******************************************************
		Destroy
	******************************************************** */

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
		if (this.oracle_running()) this.bitcoinService.abortBackfillSocket();
	}
}
