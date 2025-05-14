/* Core Dependencies */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
/* Native Dependencies */
import { MintKeyset } from '@client/modules/mint/classes/mint-keyset.class';

@Component({
	selector: 'orc-mint-subsection-keysets',
	standalone: false,
	templateUrl: './mint-subsection-keysets.component.html',
	styleUrl: './mint-subsection-keysets.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintSubsectionKeysetsComponent {

	public keysets: MintKeyset[] = [];

	constructor(
		public route: ActivatedRoute,
	) {}

	ngOnInit(): void {		
		this.keysets = this.route.snapshot.data['mint_keysets'];
		console.log('keysets', this.keysets);
	}

}
