/* Application Dependencies */
import {ChartType} from '@client/modules/mint/enums/chart-type.enum';
import {MintDataType} from '@client/modules/mint/enums/data-type.enum';
/* Shared Dependencies */
import {
	OrchardAiChatChunk,
	OrchardAiHealth,
	OrchardAiModel,
	OrchardAiAssistant,
	AiToolName,
	MintUnit,
	AnalyticsInterval,
	OrchardAiChatStream,
} from '@shared/generated.types';

export type AiChatResponse = {
	ai_chat: OrchardAiChatChunk;
};

export type AiModelResponse = {
	ai_models: OrchardAiModel[];
};

export type AiAssistantResponse = {
	ai_assistant: OrchardAiAssistant;
};

export type AiHealthResponse = {
	ai_health: OrchardAiHealth;
};

export type AiChatAbortResponse = {
	ai_chat_abort: OrchardAiChatStream;
};

export type AiFunction =
	| AiFunctionUpdateSearch
	| AiFunctionUpdateCrewStates
	| AiFunctionUpdateCrewRoles
	| AiFunctionUpdateCrewInviteRole
	| AiFunctionUpdateCrewInviteExpirationEnabled
	| AiFunctionUpdateCrewInviteExpiration
	| AiFunctionUpdateCrewLabel
	| AiFunctionUpdateCrewUserActive
	| AiFunctionUpdateDateRange
	| AiFunctionUpdateMintAnalyticsUnits
	| AiFunctionUpdateAnalyticsInterval
	| AiFunctionUpdateMintAnalyticsType
	| AiFunctionUpdateMintName
	| AiFunctionUpdateMintDescription
	| AiFunctionUpdateMintIconUrl
	| AiFunctionUpdateMintDescriptionLong
	| AiFunctionUpdateMintMotd
	| AiFunctionUpdateMintUrlAdd
	| AiFunctionUpdateMintUrlUpdate
	| AiFunctionUpdateMintUrlRemove
	| AiFunctionAddMintContact
	| AiFunctionUpdateMintContact
	| AiFunctionRemoveMintContact
	| AiFunctionUpdateMintEnabled
	| AiFunctionUpdateMintQuoteTtl
	| AiFunctionUpdateMintMethodMin
	| AiFunctionUpdateMintMethodMax
	| AiFunctionUpdateMintMethodDescription
	| AiFunctionUpdateMintKeysetStatus
	| AiFunctionUpdateMintKeysetRotationUnit
	| AiFunctionUpdateMintKeysetRotationInputFeePpk
	| AiFunctionUpdateMintKeysetRotationAmounts
	| AiFunctionUpdateMintDatabaseDataType
	| AiFunctionUpdateMintDatabaseStates
	| AiFunctionUpdateMintBackupFilename
	| AiFunctionUpdateEventLogSections
	| AiFunctionUpdateEventLogTypes
	| AiFunctionUpdateEventLogStatuses
	| AiFunctionUpdateEventLogActorIds
	| AiFunctionResetEventLogFilters;

export type AiFunctionUpdateSearch = {
	name: AiToolName.UpdateSearch;
	arguments: {
		search: string;
	};
};

export type AiFunctionUpdateCrewStates = {
	name: AiToolName.CrewStatesUpdate;
	arguments: {
		states: string[];
	};
};

export type AiFunctionUpdateCrewRoles = {
	name: AiToolName.CrewRolesUpdate;
	arguments: {
		roles: string[];
	};
};

export type AiFunctionUpdateCrewInviteRole = {
	name: AiToolName.CrewInviteRoleUpdate;
	arguments: {
		role: string;
	};
};

export type AiFunctionUpdateCrewInviteExpirationEnabled = {
	name: AiToolName.CrewInviteExpirationEnabledUpdate;
	arguments: {
		expiration_enabled: boolean;
	};
};

export type AiFunctionUpdateCrewInviteExpiration = {
	name: AiToolName.CrewInviteExpirationUpdate;
	arguments: {
		expiration_datetime: string;
	};
};

export type AiFunctionUpdateCrewLabel = {
	name: AiToolName.CrewLabelUpdate;
	arguments: {
		label: string;
	};
};

export type AiFunctionUpdateCrewUserActive = {
	name: AiToolName.CrewUserActiveUpdate;
	arguments: {
		active: boolean;
	};
};

export type AiFunctionUpdateDateRange = {
	name: AiToolName.DateRangeUpdate;
	arguments: {
		date_start: string;
		date_end: string;
	};
};

export type AiFunctionUpdateMintAnalyticsUnits = {
	name: AiToolName.MintAnalyticsUnitsUpdate;
	arguments: {
		units: MintUnit[];
	};
};

export type AiFunctionUpdateAnalyticsInterval = {
	name: AiToolName.MintAnalyticsIntervalUpdate;
	arguments: {
		interval: AnalyticsInterval;
	};
};

export type AiFunctionUpdateMintAnalyticsType = {
	name: AiToolName.MintAnalyticsTypeUpdate;
	arguments: {
		type: ChartType;
	};
};

export type AiFunctionUpdateMintName = {
	name: AiToolName.MintNameUpdate;
	arguments: {
		name: string;
	};
};

export type AiFunctionUpdateMintDescription = {
	name: AiToolName.MintDescriptionUpdate;
	arguments: {
		description: string;
	};
};

export type AiFunctionUpdateMintIconUrl = {
	name: AiToolName.MintIconUrlUpdate;
	arguments: {
		icon_url: string;
	};
};

export type AiFunctionUpdateMintDescriptionLong = {
	name: AiToolName.MintDescriptionLongUpdate;
	arguments: {
		description_long: string;
	};
};

export type AiFunctionUpdateMintMotd = {
	name: AiToolName.MintMotdUpdate;
	arguments: {
		motd: string;
	};
};

export type AiFunctionUpdateMintUrlAdd = {
	name: AiToolName.MintUrlAdd;
	arguments: {
		url: string;
	};
};

export type AiFunctionUpdateMintUrlUpdate = {
	name: AiToolName.MintUrlUpdate;
	arguments: {
		old_url: string;
		url: string;
	};
};

export type AiFunctionUpdateMintUrlRemove = {
	name: AiToolName.MintUrlRemove;
	arguments: {
		url: string;
	};
};

export type AiFunctionAddMintContact = {
	name: AiToolName.MintContactAdd;
	arguments: {
		method: 'email' | 'nostr' | 'twitter';
		info: string;
	};
};

export type AiFunctionUpdateMintContact = {
	name: AiToolName.MintContactUpdate;
	arguments: {
		old_method: 'email' | 'nostr' | 'twitter';
		old_info: string;
		method: 'email' | 'nostr' | 'twitter';
		info: string;
	};
};

export type AiFunctionRemoveMintContact = {
	name: AiToolName.MintContactRemove;
	arguments: {
		method: 'email' | 'nostr' | 'twitter';
		info: string;
	};
};

export type AiFunctionUpdateMintEnabled = {
	name: AiToolName.MintEnabledUpdate;
	arguments: {
		enabled: boolean;
		operation: 'minting' | 'melting';
	};
};

export type AiFunctionUpdateMintQuoteTtl = {
	name: AiToolName.MintQuoteTtlUpdate;
	arguments: {
		ttl: number;
		operation: 'minting' | 'melting';
	};
};

export type AiFunctionUpdateMintMethodMin = {
	name: AiToolName.MintMethodMinUpdate;
	arguments: {
		min_amount: number;
		operation: 'minting' | 'melting';
		method: string;
		unit: MintUnit;
	};
};

export type AiFunctionUpdateMintMethodMax = {
	name: AiToolName.MintMethodMaxUpdate;
	arguments: {
		max_amount: number;
		operation: 'minting' | 'melting';
		method: string;
		unit: MintUnit;
	};
};

export type AiFunctionUpdateMintMethodDescription = {
	name: AiToolName.MintMethodDescriptionUpdate;
	arguments: {
		description: boolean;
		method: string;
		unit: MintUnit;
	};
};

export type AiFunctionUpdateMintKeysetStatus = {
	name: AiToolName.MintKeysetStatusUpdate;
	arguments: {
		statuses: string[];
	};
};

export type AiFunctionUpdateMintKeysetRotationUnit = {
	name: AiToolName.MintKeysetRotationUnitUpdate;
	arguments: {
		unit: MintUnit;
	};
};

export type AiFunctionUpdateMintKeysetRotationInputFeePpk = {
	name: AiToolName.MintKeysetRotationInputFeePpkUpdate;
	arguments: {
		input_fee_ppk: number;
	};
};

export type AiFunctionUpdateMintKeysetRotationAmounts = {
	name: AiToolName.MintKeysetRotationAmountsUpdate;
	arguments: {
		amounts: number[];
	};
};

export type AiFunctionUpdateMintDatabaseDataType = {
	name: AiToolName.MintDatabaseDataTypeUpdate;
	arguments: {
		type: MintDataType;
	};
};

export type AiFunctionUpdateMintDatabaseStates = {
	name: AiToolName.MintDatabaseStatesUpdate;
	arguments: {
		states: string[];
	};
};

export type AiFunctionUpdateMintBackupFilename = {
	name: AiToolName.MintBackupFilenameUpdate;
	arguments: {
		filename: string;
	};
};

export type AiFunctionUpdateEventLogSections = {
	name: AiToolName.EventLogSectionsUpdate;
	arguments: {
		sections: string[];
	};
};

export type AiFunctionUpdateEventLogTypes = {
	name: AiToolName.EventLogTypesUpdate;
	arguments: {
		types: string[];
	};
};

export type AiFunctionUpdateEventLogStatuses = {
	name: AiToolName.EventLogStatusesUpdate;
	arguments: {
		statuses: string[];
	};
};

export type AiFunctionUpdateEventLogActorIds = {
	name: AiToolName.EventLogActorIdsUpdate;
	arguments: {
		actor_ids: string[];
	};
};

export type AiFunctionResetEventLogFilters = {
	name: AiToolName.EventLogResetFilters;
	arguments: Record<string, never>;
};
