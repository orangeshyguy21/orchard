/* Core Dependencies */
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
/* Vendor Dependencies */
import {Observable, catchError, Subscription, Subject, map, tap, throwError, shareReplay, finalize} from 'rxjs';
/* Application Dependencies */
import {ApiService} from '@client/modules/api/services/api/api.service';
import {SettingDeviceService} from '@client/modules/settings/services/setting-device/setting-device.service';
import {LocalStorageService} from '@client/modules/cache/services/local-storage/local-storage.service';
import {AuthService} from '@client/modules/auth/services/auth/auth.service';
import {OrchardWsRes} from '@client/modules/api/types/api.types';
import {getApiQuery} from '@client/modules/api/helpers/api.helpers';
import {OrchardErrors} from '@client/modules/error/classes/error.class';
import {OrchardRes} from '@client/modules/api/types/api.types';
/* Native Dependencies */
import {
	AiChatResponse,
	AiHealthResponse,
	AiModelResponse,
	AiAssistantResponse,
	AiChatAbortResponse,
	AiAgentsResponse,
	AiAgentResponse,
	AiAgentUpdateResponse,
} from '@client/modules/ai/types/ai.types';
import {AiChatChunk, AiChatToolCall} from '@client/modules/ai/classes/ai-chat-chunk.class';
import {AiHealth} from '@client/modules/ai/classes/ai-health.class';
import {AiModel} from '@client/modules/ai/classes/ai-model.class';
import {AiChatCompiledMessage} from '@client/modules/ai/classes/ai-chat-compiled-message.class';
import {AiChatConversation} from '@client/modules/ai/classes/ai-chat-conversation.class';
import {AiAssistantDefinition} from '@client/modules/ai/classes/ai-assistant-definition.class';
import {AiAgent} from '@client/modules/ai/classes/ai-agent.class';
/* Local Dependencies */
import {
	AI_CHAT_SUBSCRIPTION,
	AI_HEALTH_QUERY,
	AI_MODELS_QUERY,
	AI_ASSISTANT_QUERY,
	AI_CHAT_ABORT_MUTATION,
	AI_AGENTS_QUERY,
	AI_AGENT_QUERY,
	AI_AGENT_UPDATE_MUTATION,
} from './ai.queries';
/* Shared Dependencies */
import {AiAssistant, AiMessageRole} from '@shared/generated.types';

@Injectable({
	providedIn: 'root',
})
export class AiService {
	public get active$(): Observable<boolean> {
		return this.active_subject.asObservable();
	}
	public get conversation$(): Observable<AiChatConversation | null> {
		return this.conversation_subject.asObservable();
	}
	public get messages$(): Observable<AiChatChunk> {
		return this.message_subject.asObservable();
	}
	public get tool_calls$(): Observable<AiChatToolCall> {
		return this.toolcall_subject.asObservable();
	}
	public get assistant_requests$(): Observable<{assistant: AiAssistant; content: string | null}> {
		return this.assistant_subject.asObservable();
	}

	private subscription?: Subscription;
	private subscription_id?: string | null;
	private conversation_subject = new Subject<AiChatConversation | null>();
	private message_subject = new Subject<AiChatChunk>();
	private toolcall_subject = new Subject<AiChatToolCall>();
	private assistant_subject = new Subject<{assistant: AiAssistant; content: string | null}>();
	private active_subject = new Subject<boolean>();
	private ai_models_observable!: Observable<AiModel[]> | null;

	private conversation_cache: AiChatConversation | null = null;

	constructor(
		private apiService: ApiService,
		private settingDeviceService: SettingDeviceService,
		private localStorageService: LocalStorageService,
		private authService: AuthService,
		private router: Router,
		private http: HttpClient,
	) {}

	public getFunctionModel(): Observable<AiModel | null> {
		const set_model = this.settingDeviceService.getModel();
		return this.getAiModels().pipe(
			map((models) => {
				const set = models.find((model) => model.model === set_model);
				if (set) return set;
				return this.getSmallestFunctionModel(models);
			}),
		);
	}

	public requestAssistant(assistant: AiAssistant, content: string | null): void {
		this.assistant_subject.next({assistant, content});
	}

	public openAiSocket(assistant: AiAssistant, content: string | null, context?: string): void {
		const subscription_id = crypto.randomUUID();
		const ai_model = this.settingDeviceService.getModel();
		this.subscription_id = subscription_id;
		this.active_subject.next(true);
		this.subscription = this.apiService.gql_socket.subscribe({
			next: (response: OrchardWsRes<AiChatResponse>) => {
				if (response.type === 'data' && response.payload?.errors) {
					const has_auth_error = response.payload.errors.some((err: any) => err.extensions?.code === 10002);
					if (has_auth_error) {
						this.closeAiSocket();
						this.retryAiSocket(assistant, content, context);
						return;
					}
				}
				if (response.type === 'data' && response?.payload?.data?.ai_chat) {
					const chunk = new AiChatChunk(response.payload.data.ai_chat, subscription_id);
					this.message_subject.next(chunk);
					chunk.message.tool_calls?.forEach((tool_call) => this.toolcall_subject.next(tool_call));
					if (chunk.done) this.closeAiSocket();
				}
			},
			error: (error) => {
				console.error('Socket error:', error);
				this.subscription_id = null;
				this.active_subject.next(false);
			},
		});

		const conversation = !this.conversation_cache
			? this.createConversation(subscription_id, assistant, content, context)
			: this.continueConversation(subscription_id, assistant, content, context);
		this.conversation_subject.next(conversation);
		const messages = conversation.getMessages();
		const auth_token = this.localStorageService.getAuthToken();

		this.apiService.gql_socket.next({type: 'connection_init', payload: {}});
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
						assistant: assistant,
						auth: auth_token,
					},
				},
			},
		});
	}

	public abortAiSocket(id?: string): void {
		const subscription_id = id || this.subscription_id;
		if (!subscription_id) return;
		const query = getApiQuery(AI_CHAT_ABORT_MUTATION, {id});
		this.http
			.post<OrchardRes<AiChatAbortResponse>>(this.apiService.api, query)
			.pipe(
				map((response) => {
					if (response.errors) throw new OrchardErrors(response.errors);
					return response.data.ai_chat_abort;
				}),
				catchError((error) => {
					console.error('Error aborting ai socket:', error);
					return throwError(() => error);
				}),
				finalize(() => {
					this.closeAiSocket();
				}),
			)
			.subscribe();
	}

	private closeAiSocket(): void {
		if (!this.subscription) return;
		this.subscription?.unsubscribe();
		this.apiService.gql_socket.next({
			id: this.subscription_id,
			type: 'stop',
		});
		this.subscription_id = null;
		this.active_subject.next(false);
	}

	public getAiHealth(): Observable<AiHealth> {
		const query = getApiQuery(AI_HEALTH_QUERY);

		return this.http.post<OrchardRes<AiHealthResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.ai_health;
			}),
			map((ai_health) => new AiHealth(ai_health)),
			catchError((error) => {
				console.error('Error loading ai health:', error);
				return throwError(() => error);
			}),
		);
	}

	public getAiModels(): Observable<AiModel[]> {
		if (this.ai_models_observable) return this.ai_models_observable;
		const query = getApiQuery(AI_MODELS_QUERY);

		this.ai_models_observable = this.http.post<OrchardRes<AiModelResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.ai_models;
			}),
			map((ai_models) => ai_models.map((ai_model) => new AiModel(ai_model))),
			tap(() => {
				this.ai_models_observable = null;
			}),
			shareReplay(1),
			catchError((error) => {
				console.error('Error loading ai models:', error);
				this.ai_models_observable = null;
				return throwError(() => error);
			}),
		);
		return this.ai_models_observable;
	}

	public getAiAssistant(assistant: AiAssistant): Observable<AiAssistantDefinition> {
		const query = getApiQuery(AI_ASSISTANT_QUERY, {assistant});

		return this.http.post<OrchardRes<AiAssistantResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.ai_assistant;
			}),
			map((oaa) => new AiAssistantDefinition(oaa)),
			catchError((error) => {
				console.error('Error loading ai assistant:', error);
				return throwError(() => error);
			}),
		);
	}

	/* *******************************************************
		Agents
	******************************************************** */

	/** Fetches all AI agents */
	public getAiAgents(): Observable<AiAgent[]> {
		const query = getApiQuery(AI_AGENTS_QUERY);

		return this.http.post<OrchardRes<AiAgentsResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.ai_agents;
			}),
			map((agents) => agents.map((agent) => new AiAgent(agent))),
			catchError((error) => {
				console.error('Error loading ai agents:', error);
				return throwError(() => error);
			}),
		);
	}

	/** Fetches a single AI agent by ID */
	public getAiAgent(id: string): Observable<AiAgent> {
		const query = getApiQuery(AI_AGENT_QUERY, {id});

		return this.http.post<OrchardRes<AiAgentResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.ai_agent;
			}),
			map((agent) => new AiAgent(agent)),
			catchError((error) => {
				console.error('Error loading ai agent:', error);
				return throwError(() => error);
			}),
		);
	}

	/** Updates an AI agent configuration */
	public updateAiAgent(
		id: string,
		updates: Partial<{
			name: string;
			description: string;
			active: boolean;
			model: string;
			system_message: string;
			tools: string[];
			schedules: string[];
		}>,
	): Observable<AiAgent> {
		const query = getApiQuery(AI_AGENT_UPDATE_MUTATION, {id, ...updates});

		return this.http.post<OrchardRes<AiAgentUpdateResponse>>(this.apiService.api, query).pipe(
			map((response) => {
				if (response.errors) throw new OrchardErrors(response.errors);
				return response.data.ai_agent_update;
			}),
			map((agent) => new AiAgent(agent)),
			catchError((error) => {
				console.error('Error updating ai agent:', error);
				return throwError(() => error);
			}),
		);
	}

	private getSmallestFunctionModel(models: AiModel[]): AiModel | null {
		if (models.length === 0) return null;
		const getSize = (m: AiModel) => m.ollama?.size ?? 0;
		const llama_models = models.filter((model) => model.model.includes('llama'));
		if (llama_models.length > 0) return llama_models.sort((a, b) => getSize(a) - getSize(b))[0];
		return [...models].sort((a, b) => getSize(a) - getSize(b))[0];
	}

	private createConversation(
		id: string,
		assistant: AiAssistant,
		content: string | null,
		context: string | undefined,
	): AiChatConversation {
		const messages = [];
		if (context)
			messages.push({
				role: AiMessageRole.System,
				content: this.getFullContext(context, AiMessageRole.System),
			});
		messages.push({
			role: AiMessageRole.User,
			content: content || '',
		});
		const messages_obj = messages.map((message) => new AiChatCompiledMessage(id, message));
		return new AiChatConversation(id, messages_obj, assistant);
	}

	private continueConversation(
		id: string,
		assistant: AiAssistant,
		content: string | null,
		context: string | undefined,
	): AiChatConversation {
		if (!this.conversation_cache) throw new Error('Conversation cache not found');
		if (context) {
			const last_message = this.conversation_cache.messages[this.conversation_cache.messages.length - 1];
			if (last_message.role === AiMessageRole.Assistant && last_message.tool_calls?.length) {
				this.conversation_cache.messages.push(
					new AiChatCompiledMessage(id, {
						role: AiMessageRole.Tool,
						content: this.getFullContext(context, AiMessageRole.Tool),
					}),
				);
			}
		}
		this.conversation_cache.messages.push(
			new AiChatCompiledMessage(id, {
				role: AiMessageRole.User,
				content: content || '',
			}),
		);
		return new AiChatConversation(id, this.conversation_cache.messages, assistant);
	}

	private getFullContext(context: string, role: AiMessageRole): string {
		if (role === AiMessageRole.System) return `## Initial Form State\n\n${context}`;
		return `## Updated Form State\n\n${context}`;
	}

	private retryAiSocket(assistant: AiAssistant, content: string | null, context: string | undefined): void {
		this.closeAiSocket();
		this.authService
			.refreshToken()
			.pipe(
				tap(() => {
					this.openAiSocket(assistant, content, context);
				}),
				catchError((refresh_error) => {
					this.authService.clearAuthCache();
					this.router.navigate(['/auth']);
					return throwError(() => refresh_error);
				}),
			)
			.subscribe();
	}

	public clearConversation(): void {
		this.conversation_cache = null;
		this.conversation_subject.next(null);
	}

	public updateConversation(conversation: AiChatConversation): void {
		this.conversation_cache = conversation;
	}
}
