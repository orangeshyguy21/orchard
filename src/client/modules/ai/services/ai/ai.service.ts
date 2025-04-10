/* Core Dependencies */
import { Injectable } from '@angular/core';
/* Vendor Dependencies */
import { Observable, catchError, retry } from 'rxjs';
/* Application Dependencies */
import { ApiService } from '@client/modules/api/services/api/api.service';
import { OrchardWsRes } from '@client/modules/api/types/api.types';
/* Native Dependencies */
import { AiChatResponse } from '@client/modules/ai/types/ai.types';
/* Local Dependencies */
import { AI_CHAT_SUBSCRIPTION } from './ai.queries';

@Injectable({
	providedIn: 'root'
})
export class AiService {

	public subscription_id: string | null = null;

	constructor(
		private apiService: ApiService
	) {}

	public unsubscribeFromAiChat(): void {
		if (this.subscription_id) {
			this.apiService.gql_socket.next({
				id: this.subscription_id,
				type: 'stop'
			});
			this.subscription_id = null;
		}
	}

	public subscribeToAiChat(content: string|null): Observable<any> {
		return new Observable(observer => {
			const subscription_id = crypto.randomUUID();
			this.subscription_id = subscription_id;

			// Setup socket subscription to handle responses
			const socket_subscription = this.apiService.gql_socket.subscribe({
				next: (response: OrchardWsRes<AiChatResponse>) => {
					console.log('RESPONSE', response);
					if (response.type === 'data') {
						observer.next(response.payload?.data.ai_chat);
					} else if (response.type === 'complete') {
						observer.complete();
						this.subscription_id = null;
					}
				},
				error: (error) => {
					console.error('Socket error:', error);
					observer.error(error);
					this.subscription_id = null;
				}
			});

			// Initialize connection and start subscription
			this.apiService.gql_socket.next({ type: 'connection_init', payload: {} });
			this.apiService.gql_socket.next({
				id: subscription_id,
				type: 'start',
				payload: {
					query: AI_CHAT_SUBSCRIPTION,
					variables: {
						aiChatInput: {
							id: subscription_id,
							messages: [{ role: 'user', content }],
							model: 'llama3.2:latest',
							agent: 'orc'
						}
					}
				}
			});

			// Return cleanup function
			return () => {
				this.unsubscribeFromAiChat();
				socket_subscription.unsubscribe();
			};
		}).pipe(
			retry(3),
			catchError(error => {
				console.error('Subscription error:', error);
				throw error;
			})
		);
	}
}
