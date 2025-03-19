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
	public active_sub_section = '';
	private subscription: Subscription;

	constructor(
	  private mintService: MintService,
	  private router: Router,
	  private activatedRoute: ActivatedRoute,
	  private changeDetectorRef: ChangeDetectorRef
	) {
		this.subscription = new Subscription();
	}
  
	ngOnInit(): void {
		this.mintService.loadMintInfo().subscribe({
			next: (info:MintInfo) => {
				this.mint_info = info;
				this.changeDetectorRef.detectChanges();
			},
			error: (error) => {
				console.error('Error loading mint info:', error); // TODO: handle error
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
		let route = this.activatedRoute.root;
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
