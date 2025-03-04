import { ChangeDetectionStrategy, Component, Input, computed } from '@angular/core';

@Component({
  selector: 'orc-graphic-asset',
  standalone: false,
  templateUrl: './graphic-asset.component.html',
  styleUrl: './graphic-asset.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphicAssetComponent {

	@Input() unit! : string;
	@Input() height : string = '2rem';
	@Input() custody!: 'ecash' | 'lightning' | 'hot' | 'cold';

	public icon_name = computed(() => {
		if( !this.custody ) return 'payments';
		if( this.custody === 'ecash' ) return 'payments';
		if( this.custody === 'lightning' ) return 'bolt';
		if( this.custody === 'hot' ) return 'mode_heat';
		if( this.custody === 'cold' ) return 'ac_unit';
		return 'payments';
	});

	public lower_unit = computed(() => {
		return this.unit.toLowerCase();
	});

	public icon_size = computed(() => {
		const height_value = parseFloat(this.height);
		return (isNaN(height_value) ? 2 : height_value) * 0.7 + 'rem';
	});

}
