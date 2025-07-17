/* Core Dependencies */
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
/* Vendor Dependencies */
import {map, catchError} from 'rxjs/operators';
import {throwError, Observable} from 'rxjs';
/* Application Dependencies */
import {api, getApiQuery} from '@client/modules/api/helpers/api.helpers';
import {OrchardErrors} from '@client/modules/error/classes/error.class';
import {OrchardRes} from '@client/modules/api/types/api.types';
/* Native Dependencies */
import {PublicImage} from '@client/modules/public/classes/public-image.class';
import {PublicUrl} from '@client/modules/public/classes/public-url.class';
import {PublicImageResponse, PublicUrlResponse} from '@client/modules/public/types/public.types';
/* Local Dependencies */
import {PUBLIC_IMAGE_GET_QUERY, PUBLIC_URLS_GET_QUERY} from './public.queries';

@Injectable({
	providedIn: 'root',
})
export class PublicService {
	constructor(private http: HttpClient) {}

	getPublicImageData(url: string): Observable<PublicImage> {
		const query = getApiQuery(PUBLIC_IMAGE_GET_QUERY, {url});

		return this.http.post<OrchardRes<PublicImageResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.public_image;
			}),
			map((image) => new PublicImage(image)),
			catchError((error) => {
				console.error('Error loading public image:', error);
				return throwError(() => error);
			}),
		);
	}

	getPublicUrlsData(urls: string[]): Observable<PublicUrl[]> {
		const query = getApiQuery(PUBLIC_URLS_GET_QUERY, {urls});

		return this.http.post<OrchardRes<PublicUrlResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.public_urls;
			}),
			map((urls) => urls.map((url) => new PublicUrl(url))),
			catchError((error) => {
				console.error('Error loading public urls:', error);
				return throwError(() => error);
			}),
		);
	}
}
