/* Core Dependencies */
import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
/* Vendor Dependencies */
import {Response} from 'node-fetch';
/* Application Dependencies */
import {FetchService} from '../fetch/fetch.service';

/* Local Dependencies */
import {AiModel, AiMessage} from './ai.types';
import {AI_AGENTS} from './ai.agents';
import {AiAgent} from './ai.enums';

@Injectable()
export class AiService {
	private base_url: string;
	private chat_timeout: number = 60000;

	constructor(
		private configService: ConfigService,
		private fetchService: FetchService,
	) {
		this.base_url = this.configService.get('ai.api');
	}

	async getModels(): Promise<AiModel[]> {
		const response = await this.fetchService.fetchWithProxy(`${this.base_url}/api/tags`, {
			method: 'GET',
			headers: {'Content-Type': 'application/json'},
		});
		const data = await response.json();
		return data.models;
	}

	async streamChat(model: string, agent: AiAgent | null, messages: AiMessage[], signal?: AbortSignal): Promise<Response['body']> {
		if (!agent) agent = AiAgent.DEFAULT;
		const tools = AI_AGENTS[agent].tools;
		const system_message = AI_AGENTS[agent].system_message;
		const timeout_signal = AbortSignal.timeout(this.chat_timeout);
		const combined_signal = signal ? AbortSignal.any([signal, timeout_signal]) : timeout_signal;

		const response = await this.fetchService.fetchWithProxy(`${this.base_url}/api/chat`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				model: model,
				messages: [system_message, ...messages],
				tools: tools,
				stream: true,
			}),
			signal: combined_signal,
		});
		return response.body;
	}
}
