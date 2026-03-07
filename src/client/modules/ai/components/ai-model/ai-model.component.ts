/* Core Dependencies */
import {ChangeDetectionStrategy, Component, ElementRef, input, output, signal, computed, viewChild, ViewContainerRef, TemplateRef, OnDestroy} from '@angular/core';
import {FormControl} from '@angular/forms';
/* Vendor Dependencies */
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {TemplatePortal} from '@angular/cdk/portal';
import {Subscription} from 'rxjs';
/* Application Dependencies */
import {DeviceType} from '@client/modules/layout/types/device.types';
import {AiFavorites} from '@client/modules/cache/services/local-storage/local-storage.types';
/* Native Dependencies */
import {AiModel} from '@client/modules/ai/classes/ai-model.class';

@Component({
	selector: 'orc-ai-model',
	standalone: false,
	templateUrl: './ai-model.component.html',
	styleUrl: './ai-model.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiModelComponent implements OnDestroy {
	/* ── Injected dependencies ── */
	private readonly element_ref: ElementRef;
	private readonly overlay: Overlay;
	private readonly view_container_ref: ViewContainerRef;

	/* ── Inputs ── */
	public model = input.required<string | null>();
	public model_options = input.required<AiModel[]>();
	public device_type = input<DeviceType>('desktop');
	public vendor = input<string>('ollama');
	public favorites = input<AiFavorites>({ollama: [], openrouter: []});

	/* ── Outputs ── */
	public modelChange = output<string>();
	public favoritesChange = output<AiFavorites>();

	/* ── ViewChild refs ── */
	public panel_template = viewChild.required<TemplateRef<unknown>>('panelTemplate');

	/* ── Public properties ── */
	public search_control = new FormControl('');

	/* ── Public signals ── */
	public is_open = signal(false);
	public search_term = signal('');

	/* ── Public computed signals ── */
	public readonly favorite_ids = computed(() => {
		const fav = this.favorites();
		const vendor = this.vendor();
		return new Set(vendor === 'openrouter' ? fav.openrouter : fav.ollama);
	});

	private readonly sorted_models = computed(() => {
		const fav_ids = this.favorite_ids();
		return [...this.model_options()]
			.sort((a, b) => {
				const a_fav = fav_ids.has(a.model) ? 0 : 1;
				const b_fav = fav_ids.has(b.model) ? 0 : 1;
				if (a_fav !== b_fav) return a_fav - b_fav;
				const a_provider = a.ollama?.family || a.openrouter?.family || '';
				const b_provider = b.ollama?.family || b.openrouter?.family || '';
				if (a_provider !== b_provider) return a_provider.localeCompare(b_provider);
				return a.name.localeCompare(b.name);
			})
			.map((m) => ({ ...m, name: m.name.replace(/^[^:]+:\s*/, '') }));
	});

	public readonly displayed_models = computed(() => {
		const term = this.search_term().toLowerCase().trim();
		if (!term) return this.sorted_models();
		return this.sorted_models().filter((m) => m.name.toLowerCase().includes(term) || m.model.toLowerCase().includes(term));
	});

	/* ── Private fields ── */
	private overlay_ref: OverlayRef | null = null;
	private overlay_subs: Subscription[] = [];
	private search_sub: Subscription;

	constructor(element_ref: ElementRef, overlay: Overlay, view_container_ref: ViewContainerRef) {
		this.element_ref = element_ref;
		this.overlay = overlay;
		this.view_container_ref = view_container_ref;
		this.search_sub = this.search_control.valueChanges.subscribe((value) => {
			this.search_term.set(value || '');
		});
	}

	/* *******************************************************
		Panel
	******************************************************** */

	/** Toggles the model picker panel open/closed */
	public togglePanel(): void {
		if (this.is_open()) {
			this.closePanel();
		} else {
			this.openPanel();
		}
	}

	/** Opens the model picker overlay panel */
	public openPanel(): void {
		if (this.overlay_ref) return;

		const origin = this.element_ref;
		const is_mobile = this.device_type() === 'mobile';

		const position_strategy = is_mobile
			? this.overlay.position().global().centerHorizontally().bottom('0')
			: this.overlay
					.position()
					.flexibleConnectedTo(origin)
					.withPositions([
						{originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4},
						{originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4},
						{originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -4},
					]);

		this.overlay_ref = this.overlay.create({
			positionStrategy: position_strategy,
			hasBackdrop: true,
			backdropClass: 'cdk-overlay-transparent-backdrop',
			scrollStrategy: this.overlay.scrollStrategies.reposition(),
		});

		const portal = new TemplatePortal(this.panel_template(), this.view_container_ref);
		this.overlay_ref.attach(portal);
		this.is_open.set(true);

		this.overlay_subs.push(
			this.overlay_ref.backdropClick().subscribe(() => this.closePanel()),
			this.overlay_ref.keydownEvents().subscribe((event) => {
				if (event.key === 'Escape') {
					this.closePanel();
				}
			}),
		);
	}

	/** Closes the model picker overlay panel */
	public closePanel(): void {
		this.search_control.reset('', {emitEvent: false});
		this.search_term.set('');
		this.destroyOverlay();
		this.is_open.set(false);
	}

	/* *******************************************************
		Actions
	******************************************************** */

	/** Handles model selection from the list */
	public selectModel(model_id: string): void {
		this.modelChange.emit(model_id);
		this.addToFavorites(model_id);
		this.closePanel();
	}

	/** Adds a model to favorites if not already present */
	private addToFavorites(model_id: string): void {
		const fav = this.favorites();
		const vendor = this.vendor();
		const key = vendor === 'openrouter' ? 'openrouter' : 'ollama';
		if (fav[key].includes(model_id)) return;

		const updated: AiFavorites = {
			...fav,
			[key]: [...fav[key], model_id],
		};
		this.favoritesChange.emit(updated);
	}

	/* *******************************************************
		Destroy
	******************************************************** */

	/** Destroys the overlay ref and cleans up subscriptions */
	private destroyOverlay(): void {
		this.overlay_subs.forEach((s) => s.unsubscribe());
		this.overlay_subs = [];
		if (this.overlay_ref) {
			this.overlay_ref.dispose();
			this.overlay_ref = null;
		}
	}

	ngOnDestroy(): void {
		this.search_sub.unsubscribe();
		this.destroyOverlay();
	}
}
