/* Vendor Dependencies */
import {Subject, Observable} from 'rxjs';

/**
 * Reference to a form panel opened via FormPanelService.
 * Mirrors the MatDialogRef API — consumers call close() with an optional result,
 * and callers subscribe to afterClosed() to react.
 */
export class FormPanelRef<R = any> {
	private readonly _after_closed = new Subject<R | undefined>();

	/** Emits when the panel is closed, with an optional result value */
	public afterClosed(): Observable<R | undefined> {
		return this._after_closed.asObservable();
	}

	/** Close the panel, optionally passing a result back to the opener */
	public close(result?: R): void {
		this._after_closed.next(result);
		this._after_closed.complete();
	}
}
