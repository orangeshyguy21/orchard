/* Core Dependencies */
import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
/* Application Configuration */
import {environment} from '@client/configs/configuration';

export const enabledGuard: CanActivateFn = (route) => {
	const section = route.data['section'];
	const router = inject(Router);
	switch (section) {
		case 'bitcoin':
			if (environment.bitcoin.enabled) return true;
			router.navigate(['/bitcoin/disabled']);
			return false;
		case 'lightning':
			if (environment.lightning.enabled) return true;
			router.navigate(['/lightning/disabled']);
			return false;
		case 'mint':
			if (environment.mint.enabled) return true;
			router.navigate(['/mint/disabled']);
			return false;
		default:
			return true;
	}
};
