/* Core Dependencies */
import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
/* Vendor Dependencies */
import {map, catchError, of} from 'rxjs';
/* Application Dependencies */
import {AuthService} from '@client/modules/auth/services/auth/auth.service';

export const uninitializedGuard: CanActivateFn = (route, state) => {
	const authService = inject(AuthService);
	const router = inject(Router);
	return authService.getInitialization().pipe(
		map((is_initialized) => {
			if (is_initialized) {
				router.navigate(['/']);
				return false;
			}
			return true;
		}),
		catchError((error) => {
			console.error('Error checking initialization:', error);
			router.navigate(['authentication']);
			return of(false);
		}),
	);
};
