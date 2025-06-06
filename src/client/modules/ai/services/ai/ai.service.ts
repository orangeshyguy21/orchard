/* Core Dependencies */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/* Vendor Dependencies */
import { Observable, catchError, Subscription, Subject, map, throwError } from 'rxjs';
/* Application Configuration */
import { environment } from '@client/configs/configuration';
/* Application Dependencies */
import { ApiService } from '@client/modules/api/services/api/api.service';
import { SettingService } from '@client/modules/settings/services/setting/setting.service';
import { OrchardWsRes } from '@client/modules/api/types/api.types';
import { api, getApiQuery } from '@client/modules/api/helpers/api.helpers';
import { OrchardErrors } from '@client/modules/error/classes/error.class';
import { OrchardRes } from '@client/modules/api/types/api.types';
/* Native Dependencies */
import { AiChatResponse, AiModelResponse } from '@client/modules/ai/types/ai.types';
import { AiChatChunk, AiChatToolCall } from '@client/modules/ai/classes/ai-chat-chunk.class';
import { AiModel } from '@client/modules/ai/classes/ai-model.class';
/* Local Dependencies */
import { AI_CHAT_SUBSCRIPTION, AI_MODELS_QUERY } from './ai.queries';
/* Shared Dependencies */
import { AiAgent, AiMessageRole } from '@shared/generated.types';

@Injectable({
	providedIn: 'root'
})
export class AiService {

	public get active$(): Observable<boolean> { return this.active_subject.asObservable(); }
	public get messages$(): Observable<AiChatChunk> { return this.message_subject.asObservable(); }
    public get tool_calls$(): Observable<AiChatToolCall> { return this.toolcall_subject.asObservable(); }
	public get agent_requests$(): Observable<{agent: AiAgent, content: string|null}> {return this.agent_subject.asObservable(); }

	private subscription?: Subscription;
	private subscription_id?: string | null;
	private message_subject = new Subject<AiChatChunk>();
	private toolcall_subject = new Subject<AiChatToolCall>();
	private agent_subject = new Subject<{agent: AiAgent, content: string|null}>();
	private active_subject = new Subject<boolean>();

	constructor(
		private apiService: ApiService,
		private settingService: SettingService,
		private http: HttpClient,
	) {}

	public init(): void {
		if( !environment.ai.enabled ) return;
		const set_model = this.settingService.getModel();
		this.getAiModels().subscribe((models) => {
			// models = [];
			if( models.find((model) => model.model === set_model) ) return;
			const model = this.getSmallestFunctionModel(models);
			console.log('smallest functional model', model);
			this.settingService.setModel(model?.model || null);
		});
	}

	public closeAiSocket(): void {
		if( !this.subscription ) { return; }
		this.subscription?.unsubscribe();
		this.apiService.gql_socket.next({
			id: this.subscription_id,
			type: 'stop'
		});
		this.subscription_id = null;
		this.active_subject.next(false);
	}

	public requestAgent(agent: AiAgent, content: string|null): void {
		this.agent_subject.next({ agent, content });
	}

	public openAiSocket(agent: AiAgent, content: string|null, context?: string): void {
		const subscription_id = crypto.randomUUID();
		const ai_model = this.settingService.getModel();
		this.subscription_id = subscription_id;
		this.active_subject.next(true);
		this.subscription = this.apiService.gql_socket.subscribe({
			next: (response: OrchardWsRes<AiChatResponse>) => {
				console.log('RESPONSE HEARD:', response);
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
				this.active_subject.next(false);
			}
		});

		const messages = [{
			role: AiMessageRole.User,
			content: content
		}];
		if( context ) messages.unshift({
			role: AiMessageRole.System,
			content: context
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
						messages,
						model: ai_model,
						agent: agent
					}
				}
			}
		});
	}

	public getAiModels(): Observable<AiModel[]> {
		const query = getApiQuery(AI_MODELS_QUERY);
		return this.http.post<OrchardRes<AiModelResponse>>(api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.ai_models;
			}),
			map((aiModels) => aiModels.map((aiModel) => new AiModel(aiModel))),
			catchError((error) => {
				console.error('Error loading ai models:', error);
				return throwError(() => error);
			}),
		);
	}

	private getSmallestFunctionModel(models: AiModel[]): AiModel | null {
		if( models.length === 0 ) return null;
		const llama_models = models.filter((model) => model.model.includes('llama'));
		if( llama_models.length > 0 ) return llama_models.sort((a, b) => a.size - b.size)[0];
		return models.sort((a, b) => a.size - b.size)[0];
	}
}