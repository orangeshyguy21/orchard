/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, ElementRef, ChangeDetectorRef, HostListener } from '@angular/core';
/* Application Dependencies */
import { NonNullableMintChartSettings } from '@client/modules/chart/services/chart/chart.types';
/* Native Dependencies */
import { MintKeyset } from '@client/modules/mint/classes/mint-keyset.class';
import { MintAnalytic } from '@client/modules/mint/classes/mint-analytic.class';
import { ChartType } from '@client/modules/mint/enums/chart-type.enum';
/* Shared Dependencies */
import { MintUnit, MintAnalyticsInterval } from '@shared/generated.types';

@Component({
	selector: 'orc-mint-analytics',
	standalone: false,
	templateUrl: './mint-analytics.component.html',
	styleUrl: './mint-analytics.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintAnalyticsComponent {

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

	// @ViewChild('title_element', { read: ElementRef }) title_element!: ElementRef;
	// @ViewChild('stickytop_element', { read: ElementRef }) stickytop_element!: ElementRef;
	// @ViewChild('scroll_container', { read: ElementRef }) scroll_container!: ElementRef;

	// public sticky: boolean = false;
	// public watch_for_unsticky: boolean = false;

	// private intersection_observer!: IntersectionObserver;

	constructor(private cdr: ChangeDetectorRef) {}

	// ngAfterViewInit() {
	// 	this.setupIntersectionObserver();
	// 	this.scroll_container.nativeElement.addEventListener('scroll', () => {
	// 		if( !this.stickytop_element) return;
	// 		const element_position = this.stickytop_element.nativeElement.getBoundingClientRect().top;
	// 		const at_top = element_position >= 0;
	// 		if(!at_top) this.watch_for_unsticky = true;
	// 		if(at_top && this.watch_for_unsticky) {
	// 			this.sticky = false;
	// 			this.watch_for_unsticky = false;
	// 			this.cdr.detectChanges();
	// 		}
	// 	});
	// }

	// ngAfterViewChecked() {
	// 	if (this.sticky && this.stickytop_element && this.intersection_observer) {
	// 		try {
	// 			this.intersection_observer.observe(this.stickytop_element.nativeElement);
	// 		} catch (e) {}
	// 	}
	// }

	// private setupIntersectionObserver(): void {
	// 	const options = {
	// 		root: null,
	// 		threshold: [0, 1.0]
	// 	};

	// 	this.intersection_observer = new IntersectionObserver((entries) => {
	// 		entries.forEach(entry => {
	// 			if (entry.target === this.title_element?.nativeElement) {
	// 				if (!entry.isIntersecting) this.handleControlPanelHidden();
	// 			}
	// 		});
	// 	}, options);

	// 	if (this.title_element) {
	// 		this.intersection_observer.observe(this.title_element.nativeElement);
	// 	}
	// }

	// private handleControlPanelHidden(): void {
	// 	this.sticky = true;
	// 	this.cdr.detectChanges();
	// }

	// ngOnDestroy() {
	// 	if (this.intersection_observer) {
	// 		this.intersection_observer.disconnect();
	// 	}
	// }
}