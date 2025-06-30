/* Core Dependencies */
import { Injectable } from '@angular/core';
/* Vendor Dependencies */
import { BehaviorSubject } from 'rxjs';
/* Application Dependencies */
import { CacheEntry } from '@client/modules/cache/interfaces/cache-entry.interface';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  private cache = new Map<string, CacheEntry<any>>();

  public createCache<T>(key: string, duration: number): BehaviorSubject<T | null> {
    if(this.cache.has(key)) return this.cache.get(key)!.subject;
    this.cache.set(key, {
      subject: new BehaviorSubject<T | null | undefined>(undefined),
      last_fetch_time: 0,
      duration,
    });
    return this.cache.get(key)!.subject;
  }

  public getCache<T>(key: string): BehaviorSubject<T | null> | null {
    return this.cache.get(key)?.subject || null;
  }

  public updateCache<T>(key: string, data: T): void {
    const entry = this.cache.get(key);
    if( !entry ) return;
    entry.subject.next(data);
    entry.last_fetch_time = Date.now();
  }

  public isCacheValid(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry || !entry.last_fetch_time) return false;
    return (Date.now() - entry.last_fetch_time) < entry.duration;
  }

  public clearCache(key?: string): void {
    if( !key ) return this.clearCacheAll();
    const entry = this.cache.get(key);
    if( !entry ) return;
    entry.subject.next(null);
    entry.last_fetch_time = 0;
  }

  private clearCacheAll(): void {
    this.cache.forEach(entry => {
      entry.subject.next(null);
      entry.last_fetch_time = 0;
    });
  }
}