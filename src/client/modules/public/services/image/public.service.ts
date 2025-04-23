/* Core Dependencies */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/* Vendor Dependencies */
import { map, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
/* Application Dependencies */
import { api, getApiQuery } from '@client/modules/api/helpers/api.helpers';
import { OrchardErrors } from '@client/modules/error/classes/error.class';
import { OrchardRes } from '@client/modules/api/types/api.types';
/* Native Dependencies */
import { PublicImage } from '@client/modules/public/classes/public-image.class';
import { PublicImageResponse } from '@client/modules/public/types/public.types';
/* Local Dependencies */
import { PUBLIC_IMAGE_GET_QUERY } from './public.queries';

@Injectable({
    providedIn: 'root'
})
export class PublicService {

    constructor(
        public http: HttpClient,
    ) {}

    getPublicImageData(url: string): Observable<PublicImage> {
        const query = getApiQuery(PUBLIC_IMAGE_GET_QUERY, { url });
        return this.http.post<OrchardRes<PublicImageResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.public_image;
			}),
			map((image) => new PublicImage(image)),
			catchError((error) => {
				console.error('Error loading image:', error);
				return throwError(() => error);
			}),
		);
    }
}