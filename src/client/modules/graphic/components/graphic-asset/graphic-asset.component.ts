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
	@Input() height : string = '40px';

	public lower_unit = computed(() => {
		return this.unit.toLowerCase();
	});

}
