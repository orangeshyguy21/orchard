/* Core Dependencies */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/* Vendor Dependencies */
import { map } from 'rxjs';
/* Application Dependencies */
import { environment } from '@client/config/configuration';

@Injectable({
  providedIn: 'root'
})
export class MintService {

  constructor(
    public http: HttpClient,
  ) { }

  public test() : any {
    console.log('fetching ', environment.api.path);
    return this.http.get(`${environment.api.path}/api` )
      .pipe(
        map( (response:any) => {
          console.log(response);
          return response;
        })
      )
  }
}
