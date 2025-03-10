/* Core Dependencies */
import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
/* Vendor Dependencies */
import { forkJoin, lastValueFrom } from 'rxjs';
/* Application Dependencies */
import { MintService } from '@client/modules/mint/services/mint/mint.service';
import { MintBalance } from '@client/modules/mint/classes/mint-balance.class';
import { MintKeyset } from '@client/modules/mint/classes/mint-keyset.class';
import { MintInfo } from '@client/modules/mint/classes/mint-info.class';
import { MintAnalytic } from '@client/modules/mint/classes/mint-analytic.class';
/* Shared Dependencies */
import { MintAnalyticsInterval, MintUnit } from '@shared/generated.types';

@Component({
	selector: 'orc-mint-subsection-dashboard',
	standalone: false,
	templateUrl: './mint-subsection-dashboard.component.html',
	styleUrl: './mint-subsection-dashboard.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintSubsectionDashboardComponent implements OnInit {

	public mint_info: MintInfo | null = null;
	public mint_balances: MintBalance[] = [];
	public mint_keysets: MintKeyset[] = [];
	public mint_analytics_balances: MintAnalytic[] = [];

	public loading_static_data: boolean = true;
	public loading_dynamic_data: boolean = true;

	public selected_units: MintUnit[] = [];
	public selected_date_start: number;
	public selected_date_end!: number;
	public selected_interval: MintAnalyticsInterval = MintAnalyticsInterval.Day;

	constructor(
		private mintService: MintService,
		private changeDetectorRef: ChangeDetectorRef
	) {
		this.selected_date_start = this.getSelectedDateStart();
		this.selected_date_end = this.getSelectedDateEnd();
	}

	async ngOnInit(): Promise<void> {
		try {
			await this.loadStaticData();
			this.selected_units = this.getSelectedUnits();
			await this.loadMintAnalyticsBalances();
		} catch (error) {
			console.error('Error in initialization sequence:', error);
		}
	}

	private async loadStaticData(): Promise<void> {
		
		const info_obs = this.mintService.loadMintInfo();
		const balances_obs = this.mintService.loadMintBalances();
		const keysets_obs = this.mintService.loadMintKeysets();

		const [info, balances, keysets] = await lastValueFrom(
			forkJoin([info_obs, balances_obs, keysets_obs])
		);
		
		this.mint_info = info;
		this.mint_balances = balances;
		this.mint_keysets = keysets;
		this.loading_static_data = false;
		this.changeDetectorRef.detectChanges();
	}

	private async loadMintAnalyticsBalances(): Promise<void> {
		const analytics_balances = await lastValueFrom(this.mintService.loadMintAnalyticsBalances({
			units: this.selected_units,
			date_start: this.selected_date_start,
			date_end: this.selected_date_end,
			interval: this.selected_interval
		}));
		this.mint_analytics_balances = analytics_balances;
		console.log('mint_analytics_balances', this.mint_analytics_balances);
		this.loading_dynamic_data = false;
		this.changeDetectorRef.detectChanges();
	}

	private getSelectedUnits(): MintUnit[] {
		return this.mint_keysets.map(keyset => keyset.unit);
	}

	private getSelectedDateStart(): number {
		const three_months_ago = new Date();
		three_months_ago.setMonth(three_months_ago.getMonth() - 3);
		three_months_ago.setUTCHours(0, 0, 0, 0);
		return Math.floor(three_months_ago.getTime() / 1000);
	}

	private getSelectedDateEnd(): number {
		const today = new Date();
		today.setUTCHours(23, 59, 59, 999);
		return Math.floor(today.getTime() / 1000);
	}
}

