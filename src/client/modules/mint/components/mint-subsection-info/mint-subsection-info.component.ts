/* Core Dependencies */
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
/* Application Dependencies */
import { MintService } from '@client/modules/mint/services/mint/mint.service';
import { MintInfoRpc } from '@client/modules/mint/classes/mint-info-rpc.class';

@Component({
	selector: 'orc-mint-subsection-info',
	standalone: false,
	templateUrl: './mint-subsection-info.component.html',
	styleUrl: './mint-subsection-info.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintSubsectionInfoComponent implements OnInit {

	public init_info!: MintInfoRpc;

	constructor(
		public mintService: MintService,
		public route: ActivatedRoute,
	) {}

	async ngOnInit(): Promise<void> {
		this.init_info = this.route.snapshot.data['mint_info_rpc'];
	}
}




