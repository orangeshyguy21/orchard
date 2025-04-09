/* Core Dependencies */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/* Application Dependencies */
import { FetchService } from '../fetch/fetch.service';
/* Local Dependencies */
import { AiModel, AiMessage, AiTool } from './ai.types';

@Injectable()
export class AiService {

    private base_url: string;

	constructor(
		private configService: ConfigService,
		private fetchService: FetchService,
	){
        this.base_url = this.configService.get('ai.api');
    }

    async getModels(): Promise<AiModel[]> {
        const response = await this.fetchService.fetchWithProxy(
            `${this.base_url}/api/tags`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            },
        );
        const data = await response.json();
        return data.models;
    }

    async streamChat(model: string, agent: string, messages: AiMessage[]) {
        // based on the agent, get the tools
        // and the system prompt
        const response = await this.fetchService.fetchWithProxy(
            `${this.base_url}/api/chat`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: model,
                    messages: messages,
                    tools: [],
                }),
            },
        );
        return response.body;
    }
}