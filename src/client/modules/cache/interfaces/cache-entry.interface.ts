import {BehaviorSubject} from 'rxjs';

export interface CacheEntry<T> {
	subject: BehaviorSubject<T | null>;
	last_fetch_time: number;
	duration: number;
}
