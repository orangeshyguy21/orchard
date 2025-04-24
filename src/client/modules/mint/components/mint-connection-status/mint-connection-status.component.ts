/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, computed } from '@angular/core';
/* Application Dependencies */
import { PublicUrl } from '@client/modules/public/classes/public-url.class';

@Component({
	selector: 'orc-mint-connection-status',
	standalone: false,
	templateUrl: './mint-connection-status.component.html',
	styleUrl: './mint-connection-status.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintConnectionStatusComponent {

	@Input() public public_url!: PublicUrl;

	public get status_class_test(): string {
		if( !this.public_url ) return 'orc-surface-container-high-color';
		if( this.public_url.status !== 200 ) return 'orc-status-inactive-color';
		if( !this.public_url.has_data ) return 'orc-status-warning-color';
		if( this.public_url.has_data ) return 'orc-status-active-color';
		return 'orc-surface-container-high-color';
	}
}



// /* Core Dependencies */
// import { ChangeDetectionStrategy, Component, Input, computed } from '@angular/core';
// /* Native Dependencies */
// import { MintKeyset } from '@client/modules/mint/classes/mint-keyset.class';

// @Component({
// 	selector: 'orc-mint-keyset',
// 	standalone: false,
// 	templateUrl: './mint-keyset.component.html',
// 	styleUrl: './mint-keyset.component.scss',
// 	changeDetection: ChangeDetectionStrategy.OnPush
// })
// export class MintKeysetComponent {

// 	@Input() public active!: MintKeyset['active'];	
// 	@Input() public derivation_path!: MintKeyset['derivation_path'];
// 	@Input() public input_fee_ppk!: MintKeyset['input_fee_ppk'];

// 	public keyset_generation = computed(() => {
//         if (!this.derivation_path) return 0;
//         const path_segments = this.derivation_path.split('/');
//         const last_segment = path_segments[path_segments.length - 1];
//         const numeric_part = last_segment.replace(/'/g, '');
//         return parseInt(numeric_part) || 0;
//     });

// 	public status_class = computed(() => {
// 		if( this.active ) return 'keyset-active';
// 		return 'keyset-inactive';
// 	});

// }
