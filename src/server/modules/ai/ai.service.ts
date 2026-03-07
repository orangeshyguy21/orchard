/* Core Dependencies */
import {Injectable} from '@nestjs/common';
import {Readable} from 'stream';
/* Application Dependencies */
import {FetchService} from '@server/modules/fetch/fetch.service';
import {SettingService} from '@server/modules/setting/setting.service';
import {SettingKey} from '@server/modules/setting/setting.enums';
/* Local Dependencies */
import {AiModel, AiMessage} from './ai.types';
import {AI_ASSISTANTS} from './assistant/ai.assistants';
import {AiAssistant} from './assistant/ai.assistant.enums';

@Injectable()
export class AiService {
	private chat_timeout: number = 60000;

	constructor(
		private fetchService: FetchService,
		private settingService: SettingService,
	) {}

	/**
	 * Resolve the base URL for the configured AI vendor
	 * @returns {Promise<string>} The base URL for API calls
	 */
	private async getBaseUrl(): Promise<string> {
		const vendor_setting = await this.settingService.getSetting(SettingKey.AI_VENDOR);
		const vendor = vendor_setting?.value ?? '';
		if (vendor === 'openrouter') {
			throw new Error('OpenRouter integration is not yet implemented');
		}
		const api_setting = await this.settingService.getSetting(SettingKey.AI_OLLAMA_API);
		const base_url = api_setting?.value ?? '';
		if (!base_url) {
			throw new Error('Ollama API endpoint is not configured');
		}
		return base_url;
	}

	/**
	 * Fetch available models from the AI vendor
	 * @returns {Promise<AiModel[]>} List of available models
	 */
	async getModels(): Promise<AiModel[]> {
		const base_url = await this.getBaseUrl();
		const response = await this.fetchService.fetchWithProxy(`${base_url}/api/tags`, {
			method: 'GET',
			headers: {'Content-Type': 'application/json'},
		});
		const data = await response.json();
		return data.models;
	}

	/**
	 * Stream a chat completion from the AI vendor
	 * @param {string} model - The model identifier to use
	 * @param {AiAssistant | null} assistant - The assistant preset (defaults to DEFAULT)
	 * @param {AiMessage[]} messages - The conversation messages
	 * @param {AbortSignal} [signal] - Optional abort signal
	 * @returns {Promise<ReadableStream<Uint8Array>>} Streaming response
	 */
	async streamChat(
		model: string,
		assistant: AiAssistant | null,
		messages: AiMessage[],
		signal?: AbortSignal,
	): Promise<ReadableStream<Uint8Array>> {
		const base_url = await this.getBaseUrl();
		if (!assistant) assistant = AiAssistant.DEFAULT;
		const tools = AI_ASSISTANTS[assistant].tools;
		const system_message = AI_ASSISTANTS[assistant].system_message;
		const timeout_signal = AbortSignal.timeout(this.chat_timeout);
		const combined_signal = signal ? AbortSignal.any([signal, timeout_signal]) : timeout_signal;

		const response = await this.fetchService.fetchWithProxy(`${base_url}/api/chat`, {
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

		const nodeStream = response.body as Readable;
		return Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>;
	}
}
