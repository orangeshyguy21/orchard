/* Core Dependencies */
import {inject} from '@angular/core';
import {CanDeactivateFn} from '@angular/router';
/* Vendor Dependencies */
import {MatDialog} from '@angular/material/dialog';
import {map} from 'rxjs';
/* Application Dependencies */
import {ComponentCanDeactivate} from '@client/modules/routing/interfaces/routing.interfaces';
/* Native Dependencies */
import {EventService} from '@client/modules/event/services/event/event.service';
import {PendingEventComponent} from '../components/pending-event/pending-event.component';

export const pendingEventGuard: CanDeactivateFn<ComponentCanDeactivate> = (component) => {
	if (!component) return true;
	if (!component.canDeactivate) return true;
	if (component.canDeactivate()) return true;

	const dialog = inject(MatDialog);
	const eventService = inject(EventService);

	const dialog_ref = dialog.open(PendingEventComponent);
	return dialog_ref.afterClosed().pipe(
		map((decision) => {
			if (decision === true) {
				eventService.registerEvent(null);
				return true;
			} else {
				return false;
			}
		}),
	);
};
