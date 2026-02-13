/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, computed, inject} from '@angular/core';
import {Router} from '@angular/router';

@Component({
	selector: 'orc-mint-general-name',
	standalone: false,
	templateUrl: './mint-general-name.component.html',
	styleUrl: './mint-general-name.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintGeneralNameComponent {
	private router = inject(Router);

	public name = input<string | null>();
	public loading = input<boolean>();
	public error = input<boolean>();
	public size = input<'medium' | 'large'>('medium');

	public state = computed<string>(() => {
		if (this.loading()) return 'loading';
		if (this.error()) return 'error';
		if (this.name()) return 'name';
		return 'unset';
	});

	public onClick() {
		this.router.navigate(['mint', 'info'], {
			state: {focus_control: 'name'},
		});
	}
}
