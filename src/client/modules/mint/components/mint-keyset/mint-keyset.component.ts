/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, computed } from '@angular/core';
/* Native Dependencies */
import { MintKeyset } from '@client/modules/mint/classes/mint-keyset.class';

@Component({
	selector: 'orc-mint-keyset',
	standalone: false,
	templateUrl: './mint-keyset.component.html',
	styleUrl: './mint-keyset.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintKeysetComponent {

	@Input() public active!: MintKeyset['active'];	
	@Input() public index!: MintKeyset['derivation_path_index'];
	@Input() public input_fee_ppk!: MintKeyset['input_fee_ppk'];

	public status_class = computed(() => {
		if( this.active ) return 'keyset-active';
		return 'keyset-inactive';
	});
}