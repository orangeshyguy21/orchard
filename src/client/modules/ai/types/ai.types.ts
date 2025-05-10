/* Application Dependencies */
import { ChartType } from "@client/modules/mint/enums/chart-type.enum";
/* Shared Dependencies */
import { OrchardAiChatChunk, AiFunctionName, MintUnit, MintAnalyticsInterval } from "@shared/generated.types";

export type AiChatResponse = {
  	ai_chat: OrchardAiChatChunk;
}

export type AiFunction = 
AiFunctionUpdateMintAnalyticsDateRange |
AiFunctionUpdateMintAnalyticsUnits |
AiFunctionUpdateMintAnalyticsInterval |
AiFunctionUpdateMintAnalyticsType |
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
AiFunctionRemoveMintContact |
AiFunctionUpdateMintEnabled |
AiFunctionUpdateMintQuoteTtl |
AiFunctionUpdateMintMethodMin |
AiFunctionUpdateMintMethodMax |
AiFunctionUpdateMintMethodDescription;

export type AiFunctionUpdateMintAnalyticsDateRange = {
	name: AiFunctionName.MintAnalyticsDateRangeUpdate;
	arguments: {
		date_start: string;
		date_end: string;
	}
}

export type AiFunctionUpdateMintAnalyticsUnits = {
	name: AiFunctionName.MintAnalyticsUnitsUpdate;
	arguments: {
		units: MintUnit[];
	}
}

export type AiFunctionUpdateMintAnalyticsInterval = {
	name: AiFunctionName.MintAnalyticsIntervalUpdate;
	arguments: {
		interval: MintAnalyticsInterval;
	}
}

export type AiFunctionUpdateMintAnalyticsType = {
	name: AiFunctionName.MintAnalyticsTypeUpdate;
	arguments: {
		type: ChartType;
	}
}

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

export type AiFunctionUpdateMintEnabled = {
	name: AiFunctionName.MintEnabledUpdate;
	arguments: {
		enabled: boolean;
		operation: 'minting' | 'melting';
	}
}

export type AiFunctionUpdateMintQuoteTtl = {
	name: AiFunctionName.MintQuoteTtlUpdate;
	arguments: {
		ttl: number;
		operation: 'minting' | 'melting';
	}
}

export type AiFunctionUpdateMintMethodMin = {
	name: AiFunctionName.MintMethodMinUpdate;
	arguments: {
		min_amount: number;
		operation: 'minting' | 'melting';
		method: string;
		unit: MintUnit;
	}
}

export type AiFunctionUpdateMintMethodMax = {
	name: AiFunctionName.MintMethodMaxUpdate;
	arguments: {
		max_amount: number;
		operation: 'minting' | 'melting';
		method: string;
		unit: MintUnit;
	}
}

export type AiFunctionUpdateMintMethodDescription = {
	name: AiFunctionName.MintMethodDescriptionUpdate;
	arguments: {
		description: boolean;
		method: string;
		unit: MintUnit;
	}
}