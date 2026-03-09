/* Core Dependencies */
import {Injectable} from '@nestjs/common';
/* Application Dependencies */
import {SettingService} from '@server/modules/setting/setting.service';
import {SettingKey} from '@server/modules/setting/setting.enums';
/* Local Dependencies */
import {AiModel, AiMessage, AiTool, AiStreamChunk} from './ai.types';
import {AiVendor} from './ai.vendor';
import {OllamaService} from './ollama/ollama.service';
import {OpenRouterService} from './openrouter/openrouter.service';
import {AI_ASSISTANTS} from './assistant/ai.assistants';
import {AiAssistant} from './assistant/ai.assistant.enums';

@Injectable()
export class AiService {
	private assistant_timeout: number = 60000;
	private agent_timeout: number = 300000;

	constructor(
		private settingService: SettingService,
		private ollamaService: OllamaService,
		private openRouterService: OpenRouterService,
	) {}

	/**
	 * Resolve the vendor service based on the AI_VENDOR setting
	 * @returns {Promise<AiVendor>} The appropriate vendor service
	 */
	private async getVendor(): Promise<AiVendor> {
		const vendor_setting = await this.settingService.getSetting(SettingKey.AI_VENDOR);
		const vendor = vendor_setting?.value ?? 'ollama';
		if (vendor === 'openrouter') return this.openRouterService;
		return this.ollamaService;
	}

	/**
	 * Fetch available models from the configured vendor
	 * @returns {Promise<AiModel[]>} List of available models
	 */
	async getModels(): Promise<AiModel[]> {
		const vendor = await this.getVendor();
		return vendor.getModels();
	}

	/**
	 * Stream a chat completion for agent execution.
	 * Uses a longer timeout suitable for multi-step tool-calling loops.
	 * @param {string} model - The model identifier to use
	 * @param {AiMessage[]} messages - Full message array (including system message)
	 * @param {AiTool[]} tools - Tool definitions for function calling
	 * @param {AbortSignal} [signal] - Optional abort signal
	 * @returns {AsyncGenerator<AiStreamChunk>} Typed stream chunks
	 */
	async *streamAgent(model: string, messages: AiMessage[], tools: AiTool[], signal?: AbortSignal): AsyncGenerator<AiStreamChunk> {
		const vendor = await this.getVendor();
		const timeout_signal = AbortSignal.timeout(this.agent_timeout);
		const combined_signal = signal ? AbortSignal.any([signal, timeout_signal]) : timeout_signal;

		yield* vendor.streamChat(model, messages, tools, combined_signal);
	}

	/**
	 * Stream a chat completion for assistant chat.
	 * Resolves tools and system message from the assistant registry.
	 * @param {string} model - The model identifier to use
	 * @param {AiAssistant | null} assistant - The assistant preset (defaults to DEFAULT)
	 * @param {AiMessage[]} messages - The conversation messages
	 * @param {AbortSignal} [signal] - Optional abort signal
	 * @returns {AsyncGenerator<AiStreamChunk>} Typed stream chunks
	 */
	async *streamAssistant(
		model: string,
		assistant: AiAssistant | null,
		messages: AiMessage[],
		signal?: AbortSignal,
	): AsyncGenerator<AiStreamChunk> {
		if (!assistant) assistant = AiAssistant.DEFAULT;
		const tools = AI_ASSISTANTS[assistant].tools;
		const system_message = AI_ASSISTANTS[assistant].system_message;

		const vendor = await this.getVendor();
		const timeout_signal = AbortSignal.timeout(this.assistant_timeout);
		const combined_signal = signal ? AbortSignal.any([signal, timeout_signal]) : timeout_signal;

		yield* vendor.streamChat(model, [system_message as AiMessage, ...messages], tools, combined_signal);
	}
}
