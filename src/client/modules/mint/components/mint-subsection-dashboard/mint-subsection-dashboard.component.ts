/* Core Dependencies */
import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
/* Vendor Dependencies */
import { forkJoin, lastValueFrom } from 'rxjs';
/* Application Dependencies */
import { MintService } from '@client/modules/mint/services/mint/mint.service';
import { MintBalance } from '@client/modules/mint/classes/mint-balance.class';
import { MintKeyset } from '@client/modules/mint/classes/mint-keyset.class';
import { MintInfo } from '@client/modules/mint/classes/mint-info.class';
import { MintPromise } from '../../classes/mint-promise.class';

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
	public mint_promises: MintPromise[] = [];

	public selected_id_keysets: string[] = [];
	public selected_date_start: number;
	public selected_date_end!: number;

	constructor(
		private mintService: MintService,
		private changeDetectorRef: ChangeDetectorRef
	) {
		this.selected_date_start = this.initSelectedDateStart();
	}

	async ngOnInit(): Promise<void> {
		try {
			await this.loadStaticData();
			this.selected_id_keysets = this.initSelectedKeysets();
			// prep balance table data, do we need to do this? vars are set at the same time, not async
			await this.loadMintPromises();
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
		this.changeDetectorRef.detectChanges();
	}

	private async loadMintPromises(): Promise<void> {
		const promises = await lastValueFrom(this.mintService.loadMintPromises({
			id_keysets: this.selected_id_keysets,
			date_start: this.selected_date_start,
			date_end: this.selected_date_end
		}));
		this.mint_promises = promises;
		this.changeDetectorRef.detectChanges();
	}

	private initSelectedKeysets(): string[] {
		return this.mint_keysets.map(keyset => keyset.id);
	}

	private initSelectedDateStart(): number {
		const three_months_ago = new Date();
		three_months_ago.setMonth(three_months_ago.getMonth() - 3);
		return Math.floor(three_months_ago.getTime() / 1000);
	}
}

