/* Core Dependencies */
import { Injectable } from '@angular/core';
/* Vendor Dependencies */
import { Observable, catchError, Subscription, Subject } from 'rxjs';
/* Application Dependencies */
import { ApiService } from '@client/modules/api/services/api/api.service';
import { OrchardWsRes } from '@client/modules/api/types/api.types';
/* Shared Dependencies */
import { AiAgent, AiMessageRole } from '@shared/generated.types';
/* Native Dependencies */
import { AiChatResponse } from '@client/modules/ai/types/ai.types';
import { AiChatChunk, AiChatToolCall } from '@client/modules/ai/classes/ai-chat-chunk.class';
/* Local Dependencies */
import { AI_CHAT_SUBSCRIPTION } from './ai.queries';

@Injectable({
	providedIn: 'root'
})
export class AiService {

	public active_agent: AiAgent | null = null;

	public get active(): boolean { return !!this.subscription_id; }
	public get messages(): Observable<AiChatChunk> { return this.message_subject.asObservable(); }
    public get tool_calls(): Observable<AiChatToolCall> { return this.toolcall_subject.asObservable(); }

	private subscription?: Subscription;
	private subscription_id?: string | null;
	private message_subject = new Subject<AiChatChunk>();
	private toolcall_subject = new Subject<AiChatToolCall>();

	constructor(
		private apiService: ApiService
	) {}

	public closeAiSocket(): void {
		if( !this.subscription ) { return; }
		this.subscription?.unsubscribe();
		this.apiService.gql_socket.next({
			id: this.subscription_id,
			type: 'stop'
		});
		this.subscription_id = null;
	}

	public openAiSocket(content: string|null): void {
		const subscription_id = crypto.randomUUID();
		this.subscription_id = subscription_id;
		this.subscription = this.apiService.gql_socket.subscribe({
			next: (response: OrchardWsRes<AiChatResponse>) => {
				if (response.type === 'data' && response?.payload?.data?.ai_chat) {
					const chunk = new AiChatChunk(response.payload.data.ai_chat);
					this.message_subject.next( chunk );
					chunk.message.tool_calls?.forEach(tool_call => this.toolcall_subject.next(tool_call));
					if( chunk.done ) this.closeAiSocket();
				} 
			},
			error: (error) => {
				console.error('Socket error:', error);
				this.subscription_id = null;
			}
		});

		this.apiService.gql_socket.next({ type: 'connection_init', payload: {} });
		this.apiService.gql_socket.next({
			id: subscription_id,
			type: 'start',
			payload: {
				query: AI_CHAT_SUBSCRIPTION,
				variables: {
					ai_chat: {
						id: subscription_id,
						messages: [{ role: AiMessageRole.User, content }],
						model: 'llama3.2:latest',
						agent: this.active_agent
					}
				}
			}
		});
	}
}