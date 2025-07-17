/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
	selector: 'orc-mint-name',
	standalone: false,
	templateUrl: './mint-name.component.html',
	styleUrl: './mint-name.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('300ms ease-in', style({ opacity: 1 }))
            ])
        ])
    ]
})
export class MintNameComponent {

	@Input() name!: string | null;
    @Input() loading!: boolean;
    @Input() error!: boolean;

    public get state(): 'loading' | 'error' | 'name' | 'unset' {
        if( this.loading ) return 'loading';
        if( this.error ) return 'error';
        if( this.name ) return 'name';
        return 'unset';
    }

	constructor(
		private router: Router
	) { }

   	public onClick(){
		this.router.navigate(['mint', 'info'], {
            state: { focus_control: 'name' }
        });
	}

}
