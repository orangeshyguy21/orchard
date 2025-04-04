/* Core Dependencies */
import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, Event, ActivatedRoute } from '@angular/router';
/* Vendor Dependencies */
import { filter, Subscription } from 'rxjs';
/* Application Dependencies */
import { MintService } from '@client/modules/mint/services/mint/mint.service';
import { MintInfo } from '@client/modules/mint/classes/mint-info.class';

@Component({
	selector: 'orc-mint-section',
	standalone: false,
	templateUrl: './mint-section.component.html',
	styleUrl: './mint-section.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintSectionComponent implements OnInit, OnDestroy {

	public mint_info: MintInfo | null = null;
	public active_sub_section:string = '';
	public loading:boolean = true;
	public error:boolean = false;

	private subscription: Subscription = new Subscription();

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private changeDetectorRef: ChangeDetectorRef,
		private mintService: MintService
	) {}
  
	ngOnInit(): void {
		this.mintService.loadMintInfo().subscribe({
			next: (info:MintInfo) => {
				this.mint_info = info;
				this.loading = false;
				this.changeDetectorRef.detectChanges();
			},
			error: (error) => {
				this.error = true;
				this.loading = false;
				this.changeDetectorRef.detectChanges();
			}
		});
		this.subscription = this.router.events
			.pipe(
				filter((event: Event) => 'routerEvent' in event || 'type' in event)
			)
			.subscribe(event => {
				this.setSubSection(event);
			});
	}

	private setSubSection(event: Event): void {
		const router_event = 'routerEvent' in event ? event.routerEvent : event;
		if( router_event.type !== 1 ) return;
		let route = this.route.root;
		while (route.firstChild) {
			route = route.firstChild;
		}
		if( !route.snapshot.data ) return;
		this.active_sub_section = route.snapshot.data['sub_section'] || '';
		this.changeDetectorRef.detectChanges();
	}

	public onClickMintName(): void {
		this.router.navigate(['mint', 'info']);
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}
}
