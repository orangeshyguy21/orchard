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

@Injectable({
    providedIn: 'root'
})
export class ImageService {

    constructor(
        public http: HttpClient,
    ) {}

    getImageData(url: string): Observable<Image> {
        const query = getApiQuery(IMAGE_GET_QUERY, { url });
        return this.http.post<OrchardRes<ImageResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.public_image;
			}),
			map((image) => new Image(image)),
			catchError((error) => {
				console.error('Error loading image:', error);
				return throwError(() => error);
			}),
		);
    }
}