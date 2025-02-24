/* Core Dependencies */
import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, Event, ActivatedRoute } from '@angular/router';
/* Application Dependencies */
import { MintService } from '@client/modules/mint/services/mint/mint.service';
import { OrchardMintInfo } from '@shared/generated.types';
import { filter, Subscription } from 'rxjs';

@Component({
	selector: 'orc-mint-section',
	standalone: false,
	templateUrl: './mint-section.component.html',
	styleUrl: './mint-section.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintSectionComponent implements OnInit, OnDestroy {

	public mint_info: OrchardMintInfo | null = null;
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
			next: (info:OrchardMintInfo) => {
				this.mint_info = info;
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

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}
}
