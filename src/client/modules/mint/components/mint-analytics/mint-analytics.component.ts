/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, ElementRef, ChangeDetectorRef } from '@angular/core';
/* Application Dependencies */
import { NonNullableMintChartSettings } from '@client/modules/chart/services/chart/chart.types';
/* Native Dependencies */
import { MintKeyset } from '@client/modules/mint/classes/mint-keyset.class';
import { MintAnalytic } from '@client/modules/mint/classes/mint-analytic.class';
import { ChartType } from '@client/modules/mint/enums/chart-type.enum';
/* Shared Dependencies */
import { MintUnit, MintAnalyticsInterval } from '@shared/generated.types';
import { MintAnalyticControlPanelComponent } from '../mint-analytic-control-panel/mint-analytic-control-panel.component';

@Component({
	selector: 'orc-mint-analytics',
	standalone: false,
	templateUrl: './mint-analytics.component.html',
	styleUrl: './mint-analytics.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintAnalyticsComponent implements AfterViewInit {

	@Input() public chart_settings!: NonNullableMintChartSettings;
	@Input() public keysets!: MintKeyset[];
	@Input() public loading_static_data!: boolean;
	@Input() public loading_dynamic_data!: boolean;
	@Input() public locale!: string;
	@Input() public selected_type!: ChartType | undefined;
	@Input() public mint_analytics_balances!: MintAnalytic[];
	@Input() public mint_analytics_balances_pre!: MintAnalytic[];
	@Input() public mint_analytics_mints!: MintAnalytic[];
	@Input() public mint_analytics_mints_pre!: MintAnalytic[];
	@Input() public mint_analytics_melts!: MintAnalytic[];
	@Input() public mint_analytics_melts_pre!: MintAnalytic[];
	@Input() public mint_analytics_transfers!: MintAnalytic[];
	@Input() public mint_analytics_transfers_pre!: MintAnalytic[];

	@Output() date_change = new EventEmitter<number[]>();
	@Output() units_change = new EventEmitter<MintUnit[]>();
	@Output() interval_change = new EventEmitter<MintAnalyticsInterval>();
	@Output() type_change = new EventEmitter<ChartType>();

	@ViewChild('title_element', { read: ElementRef }) title_element!: ElementRef;

	public sticky: boolean = false;

	private intersection_observer!: IntersectionObserver;

	constructor(private cdr: ChangeDetectorRef) {}

	ngAfterViewInit() {
		this.setupIntersectionObserver();
	}

	private setupIntersectionObserver(): void {
		const options = {
			root: null, // use viewport
			threshold: 0.0 // trigger when any part becomes visible/invisible
		};

		this.intersection_observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					this.handleControlPanelVisible();
				} else {
					this.handleControlPanelHidden();
				}
			});
		}, options);

		if (this.title_element) {
			this.intersection_observer.observe(this.title_element.nativeElement);
		}
	}

	private handleControlPanelVisible(): void {
		// this.sticky = false;
		// this.cdr.detectChanges();
		// console.log('Control panel is now visible in viewport');
	}

	private handleControlPanelHidden(): void {
		this.sticky = true;
		this.cdr.detectChanges();
		console.log('Control panel is now hidden from viewport');
	}

	ngOnDestroy() {
		if (this.intersection_observer) this.intersection_observer.disconnect();
	}
}