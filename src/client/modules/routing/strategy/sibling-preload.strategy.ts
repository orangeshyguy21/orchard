/* Core Dependencies */
import {Injectable} from '@angular/core';
import {PreloadingStrategy, Route, Router, NavigationEnd} from '@angular/router';
/* Vendor Dependencies */
import {Observable, of} from 'rxjs';
import {filter} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class SiblingPreloadStrategy implements PreloadingStrategy {
	private pending_loads: Map<string, () => Observable<any>> = new Map();

	constructor(private router: Router) {
		this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe((e) => {
			setTimeout(() => this.preloadSiblings(e.urlAfterRedirects), 0);
		});
	}

	preload(route: Route, load: () => Observable<any>): Observable<any> {
		const path = route.path || '';
		const section = route.data?.['section'];
		if (section) {
			this.pending_loads.set(`${section}/${path}`, load);
		}
		return of(null);
	}

	private preloadSiblings(url: string): void {
		const base_path = url.split('/').slice(0, 2).join('/');

		this.pending_loads.forEach((load, key) => {
			if (key.startsWith(base_path.slice(1))) {
				requestIdleCallback(() => load().subscribe());
				this.pending_loads.delete(key);
			}
		});
	}
}
