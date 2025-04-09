/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Subscription, Args } from '@nestjs/graphql';
import { OnModuleInit } from '@nestjs/common';
/* Vendor Dependencies */
import { PubSub } from 'graphql-subscriptions';
/* Local Dependencies */
import { AiChatService } from './aichat.service';
import { OrchardAiChatChunk } from './aichat.model';
import { AiChatInput } from './aichat.input';

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
        this.logger.debug(`SUBSCRIPTION { ai_chat }`);
        this.aiChatService.streamChat(aiChatInput);
        return pubSub.asyncIterableIterator('ai_chat');
    }
}