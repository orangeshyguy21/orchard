/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Subscription, Args, Mutation } from '@nestjs/graphql';
import { OnModuleInit } from '@nestjs/common';
/* Vendor Dependencies */
import { PubSub } from 'graphql-subscriptions';
/* Local Dependencies */
import { AiChatService } from './aichat.service';
import { OrchardAiChatChunk, OrchardAiChatStream } from './aichat.model';
import { AiChatInput, AiChatAbortInput } from './aichat.input';

const pubSub = new PubSub();

@Resolver(() => OrchardAiChatChunk)
export class AiChatResolver implements OnModuleInit {

	private readonly logger = new Logger(AiChatResolver.name);
	
	constructor(
		private aiChatService: AiChatService,
	) {}
	
	onModuleInit() {
		this.aiChatService.onChatUpdate((chat_chunk: OrchardAiChatChunk) => {
			pubSub.publish('ai_chat', { ai_chat: chat_chunk });
		});
	}

    @Subscription(() => OrchardAiChatChunk)
    ai_chat(
        @Args('aiChatInput') aiChatInput: AiChatInput
    ) {
        this.logger.debug(`SUBSCRIPTION { ai_chat } for stream ${aiChatInput.id}`);
        this.aiChatService.streamChat(aiChatInput);
        return pubSub.asyncIterableIterator('ai_chat');
    }

    @Mutation(() => OrchardAiChatStream)
    async ai_chat_abort(
        @Args('aiChatAbortInput') aiChatAbortInput: AiChatAbortInput
    ): Promise<OrchardAiChatStream> {
        this.logger.debug(`MUTATION { ai_chat_abort } for stream ${aiChatAbortInput.id}`);
        return this.aiChatService.abortStream(aiChatAbortInput.id);
    }
}