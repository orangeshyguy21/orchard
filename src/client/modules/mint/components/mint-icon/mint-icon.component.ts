/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
	selector: 'orc-mint-icon',
	standalone: false,
	templateUrl: './mint-icon.component.html',
	styleUrl: './mint-icon.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	// prettier-ignore
	animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('300ms ease-in', style({ opacity: 1 })),
            ]),
        ]),
    ],
})
export class MintIconComponent {
	@Input() icon_data!: string | null;
	@Input() loading!: boolean;
	@Input() error!: boolean;

	public get state(): 'loading' | 'error' | 'icon' | 'unset' {
		if (this.loading) return 'loading';
		if (this.error) return 'error';
		if (this.icon_data) return 'icon';
		return 'unset';
	}

	constructor(private router: Router) {}

	public onClick() {
		this.router.navigate(['mint', 'info'], {
			state: {focus_control: 'icon_url'},
		});
	}
}
