// core
import { Directive, ElementRef, Input, HostListener } from '@angular/core';

@Directive({
  	selector: '[autogrow]',
	standalone: false
})
export class AutoGrowDirective {

	private _autogrow! : boolean; // whether or not to autogrow (this can be set using an input)
	private MAX_HEIGHT = 250; // the max height of the textarea
	private HEIGHT_BUFFER = 0; // this is a distance buffer to make the logic work in a wider range of scenarios

	@Input() set autogrow(condition: boolean){
        this._autogrow = condition != false;
    }

	constructor(
		private el: ElementRef
	){}

	/**
	 * Listen for keyevents and grow if the textarea is overflowing
	 */
	@HostListener('document:keydown', ['$event'])
	onKeydown() {
		if( this._autogrow === false ) return;
		this.grow();
	}

	/**
	 * Listen for the paste event too and grow
	 * @param event 
	 * @returns 
	 */
	@HostListener('paste', ['$event'])
	onPaste(event: ClipboardEvent) {
		if( this._autogrow === false ) return;
		setTimeout(() => {
			this.grow();
		});
	}

	/**
	 * On initialization, run the grow method
	 * exit if autogrow is set to false
	 * @returns void
	 */
	ngOnInit(){
		if( this._autogrow === false ) return;
		setTimeout(() => {
			this.grow();
		});
		this.el.nativeElement.style.overflow = 'hidden';
	}
 
	/**
	 * the grow function
	 * each time a grow is requested we measure the height of the offscreen textarea (scroll height)
	 * if the estimated new height is greater than the max height we set the height to the max height and we allow the testarea to be scrolled
	 * otherwise we set the textarea to the estimated height and we hide the scrollbar
	 * @returns void
	 */
	public grow() : void {
		this.el.nativeElement.style.height = 'auto';

		let scroll_height = this.el.nativeElement.scrollHeight;

		if( scroll_height === 0 ) return;
		let estimated_height = scroll_height + this.HEIGHT_BUFFER;

		if( estimated_height > this.MAX_HEIGHT ){
			this.el.nativeElement.style.height = `${this.MAX_HEIGHT}px`;
			this.el.nativeElement.style.overflow = 'scroll';
		}else{
			this.el.nativeElement.style.height = `${estimated_height}px`;
			this.el.nativeElement.style.overflow = 'hidden';
		}
	}
}