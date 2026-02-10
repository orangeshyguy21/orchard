/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, inject, computed} from '@angular/core';
import {Router} from '@angular/router';

@Component({
	selector: 'orc-mint-general-icon',
	standalone: false,
	templateUrl: './mint-general-icon.component.html',
	styleUrl: './mint-general-icon.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[style.--size]': 'height()',
	},
})
export class MintGeneralIconComponent {
	private router = inject(Router);

	public icon_data = input.required<string | null>();
	public loading = input.required<boolean>();
	public error = input<boolean>(false);
	public height = input<string>('2rem');

	public state = computed<string>(() => {
		if (this.loading()) return 'loading';
		if (this.error()) return 'error';
		if (this.icon_data()) return 'icon';
		return 'unset';
	});

	public onClick() {
		this.router.navigate(['mint', 'info'], {
			state: {focus_control: 'icon_url'},
		});
	}
}
