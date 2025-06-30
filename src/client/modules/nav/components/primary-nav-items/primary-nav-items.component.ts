import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'orc-primary-nav-items',
	standalone: false,
	templateUrl: './primary-nav-items.component.html',
	styleUrl: './primary-nav-items.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrimaryNavItemsComponent {

  	@Input() active_section: string = '';
	@Input() enabled_bitcoin!: boolean;
	@Input() enabled_lightning!: boolean;
	@Input() enabled_mint!: boolean;
	@Input() online_bitcoin!: boolean;
	@Input() online_lightning!: boolean;
	@Input() online_mint!: boolean;
	@Input() syncing_bitcoin!: boolean;
	@Input() syncing_lightning!: boolean;

}
