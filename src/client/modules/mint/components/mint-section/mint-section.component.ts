/* Core Dependencies */
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
/* Application Dependencies */
import { MintService } from '@client/modules/mint/services/mint/mint.service';
import { OrchardMintInfo } from '@shared/generated.types';
import { Observable } from 'rxjs';

@Component({
	selector: 'orc-mint-section',
	standalone: false,
	templateUrl: './mint-section.component.html',
	styleUrl: './mint-section.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintSectionComponent implements OnInit {

	// public mint_info$: Observable<OrchardMintInfo | null>;
	public mint_info: OrchardMintInfo | null = null;
	// public mint_info$: Observable<OrchardMintInfo | null>;

	constructor(
	  private mintService: MintService
	) {}
  
	ngOnInit(): void {
		this.mintService.loadMintInfo().subscribe({
			next: (info:OrchardMintInfo) => {
				this.mint_info = info;
				console.log('mint_info', this.mint_info);
			},
			error: (error) => {
				console.error('Error loading mint info:', error);
			}
		});
	}
}
