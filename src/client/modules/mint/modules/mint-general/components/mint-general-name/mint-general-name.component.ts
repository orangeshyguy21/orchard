/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, computed} from '@angular/core';
import {Router} from '@angular/router';

@Component({
	selector: 'orc-mint-general-name',
	standalone: false,
	templateUrl: './mint-general-name.component.html',
	styleUrl: './mint-general-name.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintGeneralNameComponent {
	public name = input<string | null>();
	public loading = input<boolean>();
	public error = input<boolean>();

	public state = computed<string>(() => {
		if (this.loading()) return 'loading';
		if (this.error()) return 'error';
		if (this.name()) return 'name';
		return 'unset';
	});

	constructor(private router: Router) {}

	public onClick() {
		this.router.navigate(['mint', 'info'], {
			state: {focus_control: 'name'},
		});
	}
}
