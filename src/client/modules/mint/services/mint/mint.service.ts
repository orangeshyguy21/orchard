/* Core Dependencies */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/* Vendor Dependencies */
import { BehaviorSubject, catchError, map, Observable, of, tap, throwError } from 'rxjs';
/* Shared Dependencies */
import { OrchardMintInfo } from '@shared/generated.types';
/* Application Dependencies */
import { api, getApiQuery } from '@client/modules/api/helpers/api.helpers';
import { GQLResponse } from '@client/modules/api/types/api.types';
import { MintInfoResponse } from '@client/modules/mint/types/mint.types';
import { CacheService } from '@client/modules/cache/services/cache/cache.service';
import { MintInfo } from '@client/modules/mint/classes/mint-info.class';
@Injectable({
  providedIn: 'root'
})
export class MintService {

  private readonly CACHE_KEYS = {
    MINT_INFO: 'mint-info',
  };

  private readonly CACHE_DURATIONS = {
    [this.CACHE_KEYS.MINT_INFO]: 30 * 60 * 1000, // 30 minutes
  };

  private mint_info_subject: BehaviorSubject<OrchardMintInfo | null>;
  public mint_info$: Observable<OrchardMintInfo | null>;

  constructor(
    public http: HttpClient,
    public cache: CacheService,
  ) {
    this.mint_info_subject = this.cache.createCache<OrchardMintInfo>(
      this.CACHE_KEYS.MINT_INFO,
      this.CACHE_DURATIONS[this.CACHE_KEYS.MINT_INFO]
    );
    this.mint_info$ = this.mint_info_subject.asObservable();
  }

  public loadMintInfo(): Observable<OrchardMintInfo> {
    if ( this.mint_info_subject.value && this.cache.isCacheValid(this.CACHE_KEYS.MINT_INFO) ) {
      return of(this.mint_info_subject.value);
    }
    
    const query = getApiQuery(`{
      mint_info{
        name
        pubkey
        version
        description
        description_long
        contact{
          method
          info
        }
        icon_url
        urls
        time
        nuts{
          nut
          disabled
          methods{
            method
            unit
            description
          }
          supported
          supported_meta{
            method
            unit
            commands
          }
        }
      }
    }`);

    return this.http.post<GQLResponse<MintInfoResponse>>(api, query).pipe(
      map((response) => response.data.mint_info),
      map((mint_info) => new MintInfo(mint_info)),
      tap((mint_info) => {
        this.cache.updateCache(this.CACHE_KEYS.MINT_INFO, mint_info);
      }),
      catchError((error) => {
        console.error('Error loading mint info:', error);
        return throwError(() => error);
      })
    );
  }
}