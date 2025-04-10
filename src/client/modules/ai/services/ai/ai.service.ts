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
	private current_subscription_id: string | null = null;

	constructor(
		private apiService: ApiService
	) {}

	public stopChatGeneration(): void {
		if (this.current_subscription_id) {
			this.apiService.gql_socket.next({
				id: this.current_subscription_id,
				type: 'stop'
			});
			this.current_subscription_id = null;
		}
	}

	public subscribeToAiChat(content: string|null): Observable<any> {
		return new Observable(observer => {
			const subscription_id = crypto.randomUUID();
			this.current_subscription_id = subscription_id;

			// Setup socket subscription to handle responses
			const socket_subscription = this.apiService.gql_socket.subscribe({
				next: (response: OrchardWsRes<AiChatResponse>) => {
					console.log('RESPONSE', response);
					if (response.type === 'data') {
						observer.next(response.payload?.data.ai_chat);
					} else if (response.type === 'complete') {
						observer.complete();
						this.current_subscription_id = null;
					}
				},
				error: (error) => {
					console.error('Socket error:', error);
					observer.error(error);
					this.current_subscription_id = null;
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
							messages: [{ role: 'user', content }],
							model: 'llama3.2:latest',
							agent: 'orc'
						}
					}
				}
			});

			// Return cleanup function
			return () => {
				console.log('UNSUBSCRIBING');
				this.stopChatGeneration();
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
