import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
	selector: 'orc-nav-primary-items',
	standalone: false,
	templateUrl: './nav-primary-items.component.html',
	styleUrl: './nav-primary-items.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavPrimaryItemsComponent {
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
