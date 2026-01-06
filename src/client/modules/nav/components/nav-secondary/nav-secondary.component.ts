/* Core Dependencies */
import {ChangeDetectionStrategy, Component, inject, OnDestroy, signal} from '@angular/core';
/* Vendor Dependencies */
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Subscription} from 'rxjs';

@Component({
	selector: 'orc-nav-secondary',
	standalone: false,
	templateUrl: './nav-secondary.component.html',
	styleUrl: './nav-secondary.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class.collapsed]': 'collapsed()',
	},
})
export class NavSecondaryComponent implements OnDestroy {
	public collapsed = signal(false);

	private breakpointObserver = inject(BreakpointObserver);
	private subscription: Subscription;

	constructor() {
		this.subscription = this.breakpointObserver.observe([Breakpoints.Large, Breakpoints.XLarge]).subscribe((result) => {
			this.collapsed.set(!result.matches);
		});
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}
}
