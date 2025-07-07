/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Subscription, Args, Mutation } from '@nestjs/graphql';
import { OnModuleInit } from '@nestjs/common';
/* Vendor Dependencies */
import { PubSub } from 'graphql-subscriptions';
/* Application Dependencies */
import { AuthService } from '@server/modules/auth/auth.service';
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
        private authService: AuthService,
	) {}
	
	onModuleInit() {
		this.aiChatService.onChatUpdate((chat_chunk: OrchardAiChatChunk) => {
			pubSub.publish('ai_chat', { ai_chat: chat_chunk });
		});
	}

    @Subscription(() => OrchardAiChatChunk)
    async ai_chat(
        @Args('ai_chat') ai_chat: AiChatInput
    ) {
        const tag = `SUBSCRIPTION { ai_chat } for stream ${ai_chat.id}`;
        this.logger.debug(tag);
        try {
            await this.authService.validateAccessToken(ai_chat.auth);
        } catch (error) {
            throw error;
        }
        this.aiChatService.streamChat(tag, ai_chat);
        return pubSub.asyncIterableIterator('ai_chat');
    }

    @Mutation(() => OrchardAiChatStream)
    async ai_chat_abort(
        @Args('ai_chat_abort') ai_chat_abort: AiChatAbortInput
    ): Promise<OrchardAiChatStream> {
        const tag = `MUTATION { ai_chat_abort } for stream ${ai_chat_abort.id}`;
        this.logger.debug(tag);
        return this.aiChatService.abortStream(ai_chat_abort.id);
    }
}