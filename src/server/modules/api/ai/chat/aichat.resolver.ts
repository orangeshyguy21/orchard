/* Core Dependencies */
import { Logger, UseGuards } from '@nestjs/common';
import { Resolver, Subscription, Args, Mutation } from '@nestjs/graphql';
import { OnModuleInit } from '@nestjs/common';
/* Vendor Dependencies */
import { PubSub } from 'graphql-subscriptions';
/* Application Dependencies */
import { GqlAuthGuard } from '@server/modules/graphql/guards/auth.guard';
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
	@UseGuards(GqlAuthGuard)
    ai_chat(
        @Args('ai_chat') ai_chat: AiChatInput
    ) {
        const tag = `SUBSCRIPTION { ai_chat } for stream ${ai_chat.id}`;
        this.logger.debug(tag);
        this.aiChatService.streamChat(tag, ai_chat);
        return pubSub.asyncIterableIterator('ai_chat');
    }

    @Mutation(() => OrchardAiChatStream)
	@UseGuards(GqlAuthGuard)
    async ai_chat_abort(
        @Args('ai_chat_abort') ai_chat_abort: AiChatAbortInput
    ): Promise<OrchardAiChatStream> {
        const tag = `MUTATION { ai_chat_abort } for stream ${ai_chat_abort.id}`;
        this.logger.debug(tag);
        return this.aiChatService.abortStream(ai_chat_abort.id);
    }
}