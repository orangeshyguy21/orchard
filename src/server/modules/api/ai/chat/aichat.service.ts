/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Vendor Dependencies */
import { EventEmitter } from 'events';
/* Application Dependencies */
import { AiService } from '@server/modules/ai/ai.service';
import { ErrorService } from '@server/modules/error/error.service';
import { OrchardErrorCode } from '@server/modules/error/error.types';
import { OrchardApiError } from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import { OrchardAiChatChunk } from './aichat.model';
import { AiChatInput } from './aichat.input';

@Injectable()
export class AiChatService {

	private readonly logger = new Logger(AiChatService.name);
	private event_emitter = new EventEmitter();
	
	constructor(
		private aiService: AiService,
		private errorService: ErrorService,
	) {}

    async streamChat(aiChatInput: AiChatInput) {
        try {
            const body = await this.aiService.streamChat(aiChatInput.model, aiChatInput.agent, aiChatInput.messages);
            if (!body)throw new OrchardApiError(OrchardErrorCode.AiError);
            const reader = body.getReader();
            const decoder = new TextDecoder();
            
            // Process chunks as they arrive
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                const chunk_json = JSON.parse(chunk);
                this.event_emitter.emit('ai.chat.update', new OrchardAiChatChunk(chunk_json));
            }
            
            return true;
        } catch (error) {
            this.logger.debug(`Error streaming chat`, error);
            const error_code = this.errorService.resolveError({ logger: this.logger, error,
                errord: OrchardErrorCode.AiError,
                msg: 'Error streaming chat response',
            });
            throw new OrchardApiError(error_code);
        }
    }

    // Register a callback for chat update events
    onChatUpdate(callback: (chat_chunk: any) => void): void {
        this.event_emitter.on('ai.chat.update', callback);
    }
}