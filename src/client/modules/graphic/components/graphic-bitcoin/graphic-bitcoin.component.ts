import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'orc-graphic-bitcoin',
	standalone: false,
	templateUrl: './graphic-bitcoin.component.html',
	styleUrl: './graphic-bitcoin.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphicBitcoinComponent {
	
   	@Input() height:string = '40px';

}
