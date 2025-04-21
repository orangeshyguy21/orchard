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
import { Image } from '@client/modules/image/classes/image.class';
import { ImageResponse } from '@client/modules/image/types/image.types';
/* Local Dependencies */
import { IMAGE_GET_QUERY } from './image.queries';
/* Shared Dependencies */
import { OrchardImage } from '@shared/generated.types';

@Injectable({
    providedIn: 'root'
})
export class ImageService {

    constructor(
        public http: HttpClient,
    ) {}

    getImageData(image_url: string): Observable<OrchardImage> {
        console.log('service image_url', image_url);
        const query = getApiQuery(IMAGE_GET_QUERY, { image_url });
        return this.http.post<OrchardRes<ImageResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.image;
			}),
			map((image) => new Image(image)),
			catchError((error) => {
				console.error('Error loading image:', error);
				return throwError(() => error);
			}),
		);
    }
}