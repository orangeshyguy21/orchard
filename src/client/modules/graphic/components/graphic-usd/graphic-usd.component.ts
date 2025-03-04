import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'orc-graphic-usd',
	standalone: false,
	templateUrl: './graphic-usd.component.html',
	styleUrl: './graphic-usd.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphicUsdComponent {

  	@Input() height:string = '40px';

}
