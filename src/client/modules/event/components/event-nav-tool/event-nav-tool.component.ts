/* Core Dependencies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
/* Application Dependencies */
import { EventData } from '@client/modules/event/classes/event-data.class';

@Component({
	selector: 'orc-event-nav-tool',
	standalone: false,
	templateUrl: './event-nav-tool.component.html',
	styleUrl: './event-nav-tool.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('iconAnimation', [
			transition('* => *', [
				style({ transform: 'scale(0.8)', opacity: 0.5 }),
				animate('200ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
			])
		]),
		trigger('enterAnimation', [
            transition(':enter', [
                style({ transform: 'scale(0.8)', opacity: 0.5 }),
                animate('200ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
            ]),
        ])
	]
})
export class EventNavToolComponent implements OnChanges {

	@Input() navroute!: string;
	@Input() active : boolean = false;
	@Input() active_event : EventData | null = null;

	@Output() save : EventEmitter<void> = new EventEmitter();

	public moused : boolean = false;
	public icon : string = 'save_clock';

	public get highlight(){ return this.active || this.moused; }
	public get pending_event(){ return this.active_event?.type === 'PENDING'; }
	public get saving(){ return this.active_event?.type === 'SAVING'; }

	public get tool_state(){
		if( this.active_event?.type === 'PENDING' ) return 'highlight';
		if( this.active_event?.type === 'SAVING' ) return 'saving';
		if( this.active_event?.type === 'SUCCESS' ) return 'success';
		if( this.active_event?.type === 'ERROR' ) return 'error';
		return 'default';
	}

	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private router: Router
	) { }

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['active_event'] && !changes['active_event'].firstChange) {
			this.onEventUpdate();
		}
	}

	private onEventUpdate(): void {
		if( !this.active_event ) {
			this.icon = 'save_clock';
			this.changeDetectorRef.detectChanges();
			return;
		}
		if( this.active_event?.type === 'PENDING' ) {
			this.icon = 'save';
		}
		if( this.active_event?.type === 'SUCCESS' ) {
			this.icon = 'check';
		}
		if( this.active_event?.type === 'ERROR' ) {
			this.icon = 'error';
		}
		this.changeDetectorRef.detectChanges();
	}

	public onMouseEnter(){
		this.moused = true;
		this.changeDetectorRef.detectChanges();
	}

	public onMouseLeave(){
		this.moused = false;
		this.changeDetectorRef.detectChanges();
	}

	public onClick(){
		if( this.pending_event ) return this.save.emit();
		this.router.navigate([this.navroute]);
	}
}