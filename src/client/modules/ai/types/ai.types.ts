import { OrchardAiChatChunk, AiFunctionName } from "@shared/generated.types";

export type AiChatResponse = {
  	ai_chat: OrchardAiChatChunk;
}

export type AiFunction = AiFunctionUpdateMintName | AiFunctionUpdateMintMotd;

export type AiFunctionUpdateMintName = {
	name: AiFunctionName.MintNameUpdate;
	arguments: {
		name: string;
	}
}

export type AiFunctionUpdateMintMotd = {
	name: AiFunctionName.MintMotdUpdate;
	arguments: {
		motd: string;
	}
}