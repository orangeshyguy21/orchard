import { OrchardAiChatChunk, AiFunctionName } from "@shared/generated.types";

export type AiChatResponse = {
  	ai_chat: OrchardAiChatChunk;
}

export type AiFunction = 
AiFunctionUpdateMintName | 
AiFunctionUpdateMintDescription | 
AiFunctionUpdateMintIconUrl | 
AiFunctionUpdateMintDescriptionLong |
AiFunctionUpdateMintMotd |  
AiFunctionUpdateMintUrlAdd | 
AiFunctionUpdateMintUrlUpdate | 
AiFunctionUpdateMintUrlRemove |
AiFunctionAddMintContact |
AiFunctionUpdateMintContact |
AiFunctionRemoveMintContact;

export type AiFunctionUpdateMintName = {
	name: AiFunctionName.MintNameUpdate;
	arguments: {
		name: string;
	}
}

export type AiFunctionUpdateMintDescription = {
	name: AiFunctionName.MintDescriptionUpdate;
	arguments: {
		description: string;
	}
}

export type AiFunctionUpdateMintIconUrl = {
	name: AiFunctionName.MintIconUrlUpdate;
	arguments: {
		icon_url: string;
	}
}

export type AiFunctionUpdateMintDescriptionLong = {
	name: AiFunctionName.MintDescriptionLongUpdate;
	arguments: {
		description_long: string;
	}
}

export type AiFunctionUpdateMintMotd = {
	name: AiFunctionName.MintMotdUpdate;
	arguments: {
		motd: string;
	}
}

export type AiFunctionUpdateMintUrlAdd = {
	name: AiFunctionName.MintUrlAdd;
	arguments: {
		url: string;
	}
}

export type AiFunctionUpdateMintUrlUpdate = {
	name: AiFunctionName.MintUrlUpdate;
	arguments: {
		old_url: string;
		url: string;
	}
}

export type AiFunctionUpdateMintUrlRemove = {
	name: AiFunctionName.MintUrlRemove;
	arguments: {
		url: string;
	}
}

export type AiFunctionAddMintContact = {
	name: AiFunctionName.MintContactAdd;
	arguments: {
		method: 'email' | 'nostr' | 'twitter';
		info: string;
	}
}

export type AiFunctionUpdateMintContact = {
	name: AiFunctionName.MintContactUpdate;
	arguments: {
		old_method: 'email' | 'nostr' | 'twitter';
		old_info: string;
		method: 'email' | 'nostr' | 'twitter';
		info: string;
	}
}

export type AiFunctionRemoveMintContact = {
	name: AiFunctionName.MintContactRemove;
	arguments: {
		method: 'email' | 'nostr' | 'twitter';
		info: string;
	}
}
