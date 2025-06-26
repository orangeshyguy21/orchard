/* Core Dependencies */
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
/* Application Dependencies */
import { AuthService } from '@client/modules/auth/services/auth/auth.service';

export const authenticationGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    if (authService.isAuthenticated()) return true;
	const current_url = state.url;
    router.navigate(['/authentication'], { 
        state: { interior_destination: current_url } 
    });
    return false;
};