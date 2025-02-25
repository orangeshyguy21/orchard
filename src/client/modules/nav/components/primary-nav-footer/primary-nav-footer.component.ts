import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'orc-primary-nav-footer',
	standalone: false,
	templateUrl: './primary-nav-footer.component.html',
	styleUrl: './primary-nav-footer.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrimaryNavFooterComponent {
  
  	@Input() active_section: string = '';

}
