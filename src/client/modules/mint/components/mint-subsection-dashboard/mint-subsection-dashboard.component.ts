/* Core Dependencies */
import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
/* Application Dependencies */
import { MintService } from '@client/modules/mint/services/mint/mint.service';
import { MintBalance } from '@client/modules/mint/classes/mint-balance.class';
import { MintKeyset } from '@client/modules/mint/classes/mint-keyset.class';
import { MintInfo } from '@client/modules/mint/classes/mint-info.class';

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

	constructor(
		private mintService: MintService,
		private changeDetectorRef: ChangeDetectorRef
	) {}

  	ngOnInit(): void {
		this.mintService.loadMintInfo().subscribe({
			next: (info:MintInfo) => {
				this.mint_info = info;
				this.changeDetectorRef.detectChanges();
				console.log('info', info);
			},
			error: (error) => {
				console.error('Error loading mint info:', error); // TODO: handle error
			}
		});

		this.mintService.loadMintBalances().subscribe({
			next: (balances:MintBalance[]) => {
				this.mint_balances = balances;
				this.changeDetectorRef.detectChanges();
				console.log('balances', balances);
			},
			error: (error) => {
				console.error('Error loading mint info:', error);
			}
		});

		this.mintService.loadMintKeysets().subscribe({
			next: (keysets:MintKeyset[]) => {
				this.mint_keysets = keysets;
				this.changeDetectorRef.detectChanges();
				console.log('keysets', keysets);
			},
			error: (error) => {
				console.error('Error loading mint keysets:', error);
			}
		});

		// loading proofs and stuff should be on some kind of filter
		// date, unit, etc.
  	}
}

