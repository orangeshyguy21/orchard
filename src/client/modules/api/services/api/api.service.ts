/* Core Dependencies */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/* Vendor Dependencies */
import { map, Observable } from 'rxjs';
/* Shared Dependencies */
import { OrchardStatus } from '@shared/generated.types';
/* Application Dependencies */
import { api, getApiQuery } from '@client/modules/api/helpers/api.helpers';
import { GQLResponse, StatusResponse } from '@client/modules/api/types/api.types';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    public http: HttpClient,
  ) { }

  public getStatus(): Observable<OrchardStatus> {
    const query = getApiQuery(`{
      status {
        online
      }
    }`);

    return this.http.post<GQLResponse<StatusResponse>>(api, query)
      .pipe(
        map((response) => response.data.status)
      );
  }
}