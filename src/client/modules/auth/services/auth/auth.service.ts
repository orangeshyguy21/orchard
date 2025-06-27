/* Core Dependencies */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map, catchError, throwError } from 'rxjs';
/* Application Dependencies */
import { api, getApiQuery } from '@client/modules/api/helpers/api.helpers';
import { OrchardErrors } from '@client/modules/error/classes/error.class';
import { OrchardRes } from '@client/modules/api/types/api.types';
import { LocalStorageService } from '@client/modules/cache/services/local-storage/local-storage.service';
/* Native Dependencies */
import { 
	AuthenticationResponse,
	RefreshAuthenticationResponse
} from '@client/modules/auth/types/auth.types';
/* Local Dependencies */
import {
	AUTHENTICATION_MUTATION,
	REFRESH_AUTHENTICATION_MUTATION
} from './auth.queries';
/* Shared Dependencies */
import { OrchardAuthentication } from '@shared/generated.types';

@Injectable({
  	providedIn: 'root'
})
export class AuthService {

	constructor(
		private http: HttpClient,
		private localStorageService: LocalStorageService
	) {}

	public authenticate(password: string): Observable<OrchardAuthentication> {
		const query = getApiQuery(AUTHENTICATION_MUTATION, { authentication: { password } });

		return this.http.post<OrchardRes<AuthenticationResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.authentication;
			}),
			tap((authentication) => {
				this.localStorageService.setAuthToken(authentication.access_token);
				this.localStorageService.setRefreshToken(authentication.refresh_token);
			}),
			catchError((error) => {
				console.error('Error authenticating:', error);
				return throwError(() => error);
			}),
		);
	}

	public refreshToken(): Observable<OrchardAuthentication> {
		const refresh_token = this.localStorageService.getRefreshToken();
		if (!refresh_token) {
			return throwError(() => new Error('No refresh token available'));
		}

		const query = getApiQuery(REFRESH_AUTHENTICATION_MUTATION, {});
		const headers = { 'Authorization': `Bearer ${refresh_token}` };

		return this.http.post<OrchardRes<RefreshAuthenticationResponse>>(api, query, { headers }).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.refresh_authentication;
			}),
			tap((refresh_authentication) => {
				this.localStorageService.setAuthToken(refresh_authentication.access_token);
				this.localStorageService.setRefreshToken(refresh_authentication.refresh_token);
			}),
			catchError((error) => {
				console.error('Error refreshing token:', error);
				this.logout();
				return throwError(() => error);
			}),
		);
	}

	public logout(): void {
		this.localStorageService.setAuthToken(null);
		this.localStorageService.setRefreshToken(null);
	}

	public isAuthenticated(): boolean {
		return this.hasValidToken();
	}

	public getAuthHeaders(): Record<string, string> {
		const token = this.localStorageService.getAuthToken();
		return token ? { 'Authorization': 'Bearer ' + token } : {};
	}

	private hasValidToken(): boolean {
		const token = this.localStorageService.getAuthToken();
		if (!token) return false;
		
		try {
			const payload = JSON.parse(atob(token.split('.')[1]));
			const expiration_time = payload.exp * 1000;
			return Date.now() < expiration_time;
		} catch {
			return false;
		}
	}
}
