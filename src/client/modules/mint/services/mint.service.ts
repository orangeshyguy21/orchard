/* Core Dependencies */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/* Vendor Dependencies */
import { map, Observable } from 'rxjs';
/* Shared Dependencies */
import { OrchardStatus } from '@shared/generated.types';
/* Application Dependencies */
import { environment } from '@client/config/configuration';

@Injectable({
  providedIn: 'root'
})
export class MintService {

  constructor(
    public http: HttpClient,
  ) { }

  public getStatus() : Observable<OrchardStatus> {
    return this.http.get<OrchardStatus>(`${environment.api.path}/api?query={status{online}}` )
      .pipe(
        map( (response:any) => {
          console.log(response);
          return response;
        })
      )
  }
}



// curl 'http://localhost:3321/api' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:3321' --data-binary '{"query":"{\n  status{\n    online\n  }\n}"}' --compressed