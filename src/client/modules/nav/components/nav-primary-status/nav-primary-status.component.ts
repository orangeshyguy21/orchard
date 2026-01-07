import {ChangeDetectionStrategy, Component, input, computed} from '@angular/core';

@Component({
	selector: 'orc-nav-primary-status',
	standalone: false,
	templateUrl: './nav-primary-status.component.html',
	styleUrl: './nav-primary-status.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavPrimaryStatusComponent {
	public size = input<'small' | 'medium'>('small');
	public enabled = input<boolean>(false);
	public online = input<boolean>(false);
	public syncing = input<boolean>(false);

	public size_class = computed(() => {
		if (this.size() === 'small') return 'indicator-circle-small';
		if (this.size() === 'medium') return 'indicator-circle-medium';
		return 'indicator-circle-small';
	});

	public indicator_class = computed(() => {
		if (!this.enabled()) return '';
		if (this.online() === false) return 'trans-bg-medium orc-status-inactive-bg';
		if (this.syncing() === true) return 'trans-bg-medium orc-status-warning-bg';
		if (this.online() === true) return 'trans-bg-medium orc-status-active-bg';
		return 'orc-animation-shimmer-highest';
	});
}
