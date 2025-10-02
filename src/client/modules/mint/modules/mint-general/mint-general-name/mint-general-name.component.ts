/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Router} from '@angular/router';

@Component({
	selector: 'orc-mint-general-name',
	standalone: false,
	templateUrl: './mint-general-name.component.html',
	styleUrl: './mint-general-name.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintGeneralNameComponent {
	@Input() name!: string | null;
	@Input() loading!: boolean;
	@Input() error!: boolean;

	public get state(): 'loading' | 'error' | 'name' | 'unset' {
		if (this.loading) return 'loading';
		if (this.error) return 'error';
		if (this.name) return 'name';
		return 'unset';
	}

	constructor(private router: Router) {}

	public onClick() {
		this.router.navigate(['mint', 'info'], {
			state: {focus_control: 'name'},
		});
	}
}
