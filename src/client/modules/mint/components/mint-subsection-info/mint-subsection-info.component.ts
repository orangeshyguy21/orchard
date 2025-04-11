/* Core Dependencies */
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
/* Application Dependencies */
import { MintService } from '@client/modules/mint/services/mint/mint.service';

@Component({
	selector: 'orc-mint-subsection-info',
	standalone: false,
	templateUrl: './mint-subsection-info.component.html',
	styleUrl: './mint-subsection-info.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintSubsectionInfoComponent implements OnInit {

	constructor(
		public mintService: MintService,
		public route: ActivatedRoute,
	) {}

	async ngOnInit(): Promise<void> {
		let test = this.route.snapshot.data['mint_info_rpc'];
		console.log(test);
	}
}




