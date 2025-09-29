/* Core Dependencies */
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	input,
	signal,
	computed,
	effect,
	Output,
	ViewChild,
	ElementRef,
} from '@angular/core';
import {Router} from '@angular/router';
/* Application Dependencies */
import {EventData} from '@client/modules/event/classes/event-data.class';

@Component({
	selector: 'orc-event-nav-tool',
	standalone: false,
	templateUrl: './event-nav-tool.component.html',
	styleUrl: './event-nav-tool.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventNavToolComponent {
	public navroute = input.required<string>();
	public active = input<boolean>(false);
	public active_event = input<EventData | null>(null);

	@Output() save: EventEmitter<void> = new EventEmitter();
	@Output() cancel: EventEmitter<void> = new EventEmitter();

	@ViewChild('icon_collapsed', {read: ElementRef}) icon_collapsed!: ElementRef<HTMLElement>;
	@ViewChild('icon_expanded', {read: ElementRef}) icon_expanded!: ElementRef<HTMLElement>;

	public moused = signal<boolean>(false);

	public highlight = computed(() => this.active() || this.moused());
	public pending_event = computed(() => this.active_event()?.type === 'PENDING');
	public saving = computed(() => this.active_event()?.type === 'SAVING');
	public icon = computed(() => {
		const active_event = this.active_event();
		if (!active_event) return 'save_clock';
		if (active_event.type === 'PENDING') return 'save';
		if (active_event.type === 'SUCCESS') return 'check';
		if (active_event.type === 'WARNING') return 'warning';
		if (active_event.type === 'ERROR') return 'error';
		return 'save_clock';
	});
	public container_class = computed(() => {
		const event_type = this.active_event()?.type;
		if (event_type === 'SAVING') return 'nav-tool-saving';
		if (event_type === 'SUCCESS') return 'nav-tool-success';
		if (event_type === 'WARNING') return 'nav-tool-warning';
		if (event_type === 'ERROR') return 'nav-tool-error';
		if (event_type === 'PENDING') return 'nav-tool-highlight';
		return '';
	});
	public morph_state = computed(() => {
		const active_event = this.active_event();
		if (active_event?.type === 'PENDING' && active_event?.message) return 'actionable';
		return 'default';
	});

	constructor(private router: Router) {
		effect(() => {
			this.icon();
			this.animate();
		});
	}

	public onMouseEnter() {
		this.moused.set(true);
	}

	public onMouseLeave() {
		this.moused.set(false);
	}

	public onClick() {
		if (this.pending_event()) return this.save.emit();
		this.router.navigate([this.navroute()]);
	}

	private animate(): void {
		const icon_collapsed = this.icon_collapsed?.nativeElement;
		const icon_expanded = this.icon_expanded?.nativeElement;
		if (icon_collapsed) this.animatePop(icon_collapsed);
		if (icon_expanded) this.animatePop(icon_expanded);
	}

	private animatePop(el: HTMLElement): void {
		if (!el) return;
		for (const anim of el.getAnimations()) anim.cancel();
		el.animate(
			[
				{transform: 'scale(0.8)', opacity: 0.5},
				{transform: 'scale(1)', opacity: 1},
			],
			{duration: 200, easing: 'ease-out', fill: 'both'},
		);
	}
}
