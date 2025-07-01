/* Core Dependencies */
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
/* Application Dependencies */
import { AuthService } from '@client/modules/auth/services/auth/auth.service';

export const authenticationGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    if (authService.isAuthenticated()) return true;
    return authService.refreshToken().pipe(
        map(() => true), // Successfully refreshed, allow access
        catchError(() => {
            // Refresh failed, redirect to authentication
            const current_url = state.url;
            console.log('refresh failed, redirecting to authentication', current_url);
            router.navigate(['/authentication'], { 
                state: { interior_destination: current_url } 
            });
            return of(false);
        })
    );
};