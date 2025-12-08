/* Core Dependencies */
import {Injectable} from '@angular/core';
import {PreloadingStrategy, Route, Router} from '@angular/router';
/* Vendor Dependencies */
import {Observable, of, timer} from 'rxjs';
import {mergeMap} from 'rxjs/operators';

/**
 * Custom preloading strategy that preloads all routes within the currently active section.
 * When user navigates to /mint/dashboard, this preloads all other mint/* routes
 * but does NOT preload bitcoin/*, lightning/*, etc. until those sections are visited.
 */
@Injectable({providedIn: 'root'})
export class SectionPreloadStrategy implements PreloadingStrategy {
	private preloaded_sections: Set<string> = new Set(); // tracks which sections have been preloaded

	constructor(private router: Router) {}

	/**
	 * Determines whether to preload a given route
	 * @param {Route} route - the route to potentially preload
	 * @param {() => Observable<any>} load - function to trigger the preload
	 * @returns {Observable<any>} observable that triggers preload or skips
	 */
	preload(route: Route, load: () => Observable<any>): Observable<any> {
		const route_section = route.data?.['section'] || null;
		const active_section = this.getActiveSection();
		// no section data - skip preloading
		if (!route_section) return of(null);
		// if this route belongs to the active section, preload it with a small delay
		if (route_section === active_section) {
			this.preloaded_sections.add(route_section);
			return timer(1500).pipe(mergeMap(() => load()));
		}
		// if we've previously visited this section, preload its routes
		if (this.preloaded_sections.has(route_section)) {
			return timer(1500).pipe(mergeMap(() => load()));
		}
		// otherwise, don't preload yet
		return of(null);
	}

	/**
	 * Gets the currently active section from route data by traversing to the deepest child
	 * @returns {string | null} active section name
	 */
	private getActiveSection(): string | null {
		let route = this.router.routerState.root;

		while (route.firstChild) {
			route = route.firstChild;
		}

		let current: typeof route | null = route;
		while (current) {
			const section = current.snapshot.data?.['section'];
			if (section) return section;
			current = current.parent;
		}

		return null;
	}
}
