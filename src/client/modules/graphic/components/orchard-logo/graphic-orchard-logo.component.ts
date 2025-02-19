import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'orc-graphic-orchard-logo',
	standalone: false,
	templateUrl: './graphic-orchard-logo.component.html',
	styleUrl: './graphic-orchard-logo.component.scss',
  	changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphicOrchardLogoComponent {

    @Input() height:string = '40px';
	
}
