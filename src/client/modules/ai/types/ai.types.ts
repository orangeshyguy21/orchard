import { OrchardAiChatChunk, AiFunctionName } from "@shared/generated.types";

export type AiChatResponse = {
  	ai_chat: OrchardAiChatChunk;
}

export type AiFunction = AiFunctionUpdateMintName;

export type AiFunctionUpdateMintName = {
	name: AiFunctionName.MintNameUpdate;
	arguments: {
		name: string;
	}
}

// export type AiFunctionUpdateMintName = {
// 	name: 'update_mint_name';
// 	arguments: {
// 		name: string;
// 	}
// }