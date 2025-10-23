/* Core Dependencies */
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap, map, catchError, throwError, BehaviorSubject, of} from 'rxjs';
/* Application Dependencies */
import {getApiQuery} from '@client/modules/api/helpers/api.helpers';
import {OrchardErrors} from '@client/modules/error/classes/error.class';
import {OrchardRes} from '@client/modules/api/types/api.types';
import {LocalStorageService} from '@client/modules/cache/services/local-storage/local-storage.service';
import {ConfigService} from '@client/modules/config/services/config.service';
import {ApiService} from '@client/modules/api/services/api/api.service';
/* Native Dependencies */
import {
	InitializationResponse,
	InitializeResponse,
	AuthenticationResponse,
	RefreshAuthenticationResponse,
	RevokeAuthenticationResponse,
} from '@client/modules/auth/types/auth.types';
/* Local Dependencies */
import {
	INITIALIZATION_QUERY,
	INITIALIZE_MUTATION,
	AUTHENTICATION_MUTATION,
	REFRESH_AUTHENTICATION_MUTATION,
	REVOKE_AUTHENTICATION_MUTATION,
} from './auth.queries';
/* Shared Dependencies */
import {OrchardAuthentication} from '@shared/generated.types';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private initialization_subject: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);

	constructor(
		private http: HttpClient,
		private localStorageService: LocalStorageService,
		private configService: ConfigService,
		private apiService: ApiService,
	) {}

	/**
	 * Gets initialization status. Makes API call only on first access.
	 * @returns {Observable<boolean>} Observable of initialization state
	 */
	public getInitialization(): Observable<boolean> {
		const current_value = this.initialization_subject.value;
		if (current_value !== null) {
			return of(current_value);
		}

		const query = getApiQuery(INITIALIZATION_QUERY, {});
		return this.http.post<OrchardRes<InitializationResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.auth_initialization.initialization;
			}),
			tap((is_initialized) => {
				this.initialization_subject.next(is_initialized);
			}),
			catchError((error) => {
				console.error('Error getting initialization:', error);
				this.initialization_subject.next(false);
				return throwError(() => error);
			}),
		);
	}

	public initialize(key: string, name: string, password: string): Observable<OrchardAuthentication> {
		const query = getApiQuery(INITIALIZE_MUTATION, {initialize: {key, name, password}});
		return this.http.post<OrchardRes<InitializeResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.auth_initialize;
			}),
			tap((initialize) => {
				this.localStorageService.setAuthToken(initialize.access_token);
				this.localStorageService.setRefreshToken(initialize.refresh_token);
			}),
			catchError((error) => {
				console.error('Error initializing:', error);
				return throwError(() => error);
			}),
		);
	}

	public authenticate(name: string, password: string): Observable<OrchardAuthentication> {
		const query = getApiQuery(AUTHENTICATION_MUTATION, {authentication: {name, password}});

		return this.http.post<OrchardRes<AuthenticationResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.auth_authentication;
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
		if (!refresh_token) return throwError(() => new Error('No refresh token available'));

		const query = getApiQuery(REFRESH_AUTHENTICATION_MUTATION, {});
		const headers = {Authorization: `Bearer ${refresh_token}`};

		return this.http.post<OrchardRes<RefreshAuthenticationResponse>>(this.apiService.api, query, {headers}).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.auth_authentication_refresh;
			}),
			tap((refresh_authentication) => {
				this.localStorageService.setAuthToken(refresh_authentication.access_token);
				this.localStorageService.setRefreshToken(refresh_authentication.refresh_token);
			}),
			catchError((error) => {
				console.error('Error refreshing token:', error);
				this.clearAuthCache();
				return throwError(() => error);
			}),
		);
	}

	public revokeToken(): Observable<boolean> {
		const refresh_token = this.localStorageService.getRefreshToken();
		if (!refresh_token) return throwError(() => new Error('No refresh token available'));

		const query = getApiQuery(REVOKE_AUTHENTICATION_MUTATION, {});
		const headers = {Authorization: `Bearer ${refresh_token}`};

		return this.http.post<OrchardRes<RevokeAuthenticationResponse>>(this.apiService.api, query, {headers}).pipe(
			map((response) => {
				this.clearAuthCache();
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.auth_authentication_revoke;
			}),
			catchError((error) => {
				console.error('Error revoking token:', error);
				this.clearAuthCache();
				return throwError(() => error);
			}),
		);
	}

	/**
	 * Clears the cached initialization state (call after completing initialization)
	 * @returns {void}
	 */
	public clearInitializationCache(): void {
		this.initialization_subject.next(null);
	}

	public clearAuthCache(): void {
		this.localStorageService.setAuthToken(null);
		this.localStorageService.setRefreshToken(null);
	}

	public isAuthenticated(): boolean {
		if (!this.configService.config.mode.production) return true;
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

	public getAuthHeaders(): Record<string, string> {
		const token = this.localStorageService.getAuthToken();
		return token ? {Authorization: 'Bearer ' + token} : {};
	}
}
