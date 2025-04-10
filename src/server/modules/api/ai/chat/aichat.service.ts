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
import { OrchardAiChatChunk, OrchardAiChatStream } from './aichat.model';
import { AiChatInput } from './aichat.input';

@Injectable()
export class AiChatService {

	private readonly logger = new Logger(AiChatService.name);
	private event_emitter = new EventEmitter();
	private active_streams: Map<string, AbortController> = new Map();

	constructor(
		private aiService: AiService,
		private errorService: ErrorService,
	) {}

    public async streamChat(aiChatInput: AiChatInput) {
        try {
            const controller = new AbortController();
            this.active_streams.set(aiChatInput.id, controller);
            const signal = controller.signal;
            const body = await this.aiService.streamChat(aiChatInput.model, aiChatInput.agent, aiChatInput.messages, signal);
            if (!body)throw new OrchardApiError(OrchardErrorCode.AiError);
            const reader = body.getReader();
            const decoder = new TextDecoder();
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                chunk.split('\n')
                    .filter(str => str.trim())
                    .map(json_str => {
                        try {
                            return JSON.parse(json_str);
                        } catch (parse_error) {
                            throw new OrchardApiError(OrchardErrorCode.AiStreamParseError);
                        }
                    })
                    .filter(chunk_json => chunk_json !== null)
                    .forEach(chunk_json => {
                        this.event_emitter.emit('ai.chat.update', new OrchardAiChatChunk(chunk_json, aiChatInput.id));
                    });
            }
            
            this.active_streams.delete(aiChatInput.id);
            return true;
        } catch (error) {
            this.active_streams.delete(aiChatInput.id);
            if (error instanceof DOMException && error.name === 'AbortError') {
                this.logger.debug(`Chat was aborted for stream ${aiChatInput.id}`);
                return false;
            }
            if (error instanceof DOMException && error.name === 'TimeoutError') {
                this.logger.debug(`Chat timed out for stream ${aiChatInput.id}`);
                return false;
            }
            this.logger.debug(`Error streaming chat`, error);
            const error_code = this.errorService.resolveError({ logger: this.logger, error,
                errord: OrchardErrorCode.AiError,
                msg: 'Error streaming chat response',
            });
            throw new OrchardApiError(error_code);
        }
    }

    public onChatUpdate(callback: (chat_chunk: OrchardAiChatChunk) => void): void {
        this.event_emitter.on('ai.chat.update', callback);
    }

    public abortStream(id: string): OrchardAiChatStream {
        const controller = this.active_streams.get(id);
        if( !controller ) throw new OrchardApiError(OrchardErrorCode.AiStreamError);
        controller.abort();
        this.active_streams.delete(id);
        return { id };
    }
}