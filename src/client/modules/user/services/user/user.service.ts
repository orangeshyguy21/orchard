/* Core Dependencies */
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
/* Vendor Dependencies */
import {BehaviorSubject, catchError, map, Observable, of, shareReplay, tap, throwError} from 'rxjs';
/* Application Dependencies */
import {getApiQuery} from '@client/modules/api/helpers/api.helpers';
import {OrchardErrors} from '@client/modules/error/classes/error.class';
import {OrchardRes} from '@client/modules/api/types/api.types';
import {CacheService} from '@client/modules/cache/services/cache/cache.service';
import {ApiService} from '@client/modules/api/services/api/api.service';
/* Shared Dependencies */
import {OrchardUser} from '@shared/generated.types';
/* Native Dependencies */
import {User} from '@client/modules/user/classes/user.class';
import {UserResponse, UserNameUpdateResponse, UserPasswordUpdateResponse} from '@client/modules/user/types/user.types';
/* Local Dependencies */
import {USER_QUERY, USER_NAME_UPDATE_MUTATION, USER_PASSWORD_UPDATE_MUTATION} from './user.queries';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	public get user$(): Observable<OrchardUser | null> {
		return this.user_subject.asObservable();
	}

	private readonly CACHE_KEYS = {
		USER: 'user',
	};
	private readonly CACHE_DURATIONS = {
		[this.CACHE_KEYS.USER]: 1 * 60 * 1000, // 1 minute
	};

	/* Subjects for caching */
	private readonly user_subject!: BehaviorSubject<OrchardUser | null>;

	/* Observables for caching (rapid request caching) */
	private user_observable!: Observable<OrchardUser> | null;

	constructor(
		private http: HttpClient,
		private cache: CacheService,
		private apiService: ApiService,
	) {
		this.user_subject = this.cache.createCache<OrchardUser>(this.CACHE_KEYS.USER, this.CACHE_DURATIONS[this.CACHE_KEYS.USER]);
	}

	public clearUserCache() {
		this.cache.clearCache(this.CACHE_KEYS.USER);
	}

	public loadUser(): Observable<OrchardUser> {
		if (this.user_subject.value && this.cache.isCacheValid(this.CACHE_KEYS.USER)) return of(this.user_subject.value);
		if (this.user_observable) return this.user_observable;

		const query = getApiQuery(USER_QUERY);

		this.user_observable = this.http.post<OrchardRes<UserResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.user;
			}),
			map((user) => new User(user)),
			tap((user) => {
				this.cache.updateCache(this.CACHE_KEYS.USER, user);
				this.user_subject.next(user);
				this.user_observable = null;
			}),
			shareReplay(1),
			catchError((error) => {
				this.user_observable = null;
				this.user_subject.next(null);
				return throwError(() => error);
			}),
		);
		return this.user_observable;
	}

	public updateUserName(name: string): Observable<OrchardUser> {
		const query = getApiQuery(USER_NAME_UPDATE_MUTATION, {name});
		return this.http.post<OrchardRes<UserNameUpdateResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.user_name_update;
			}),
			catchError((error) => {
				console.error('Error updating user name:', error);
				return throwError(() => error);
			}),
		);
	}

	public updateUserPassword(password_old: string, password_new: string): Observable<OrchardUser> {
		const query = getApiQuery(USER_PASSWORD_UPDATE_MUTATION, {password_old, password_new});
		return this.http.post<OrchardRes<UserPasswordUpdateResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.user_password_update;
			}),
			catchError((error) => {
				console.error('Error updating user password:', error);
				return throwError(() => error);
			}),
		);
	}
}
