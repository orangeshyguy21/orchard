/* Local Dependencies */
import {AiAgent} from './ai.enums';
import {
	UpdateSearchTool,
	UpdateCrewStatesTool,
	UpdateCrewRolesTool,
	UpdateCrewInviteRoleTool,
	UpdateCrewInviteExpirationEnabledTool,
	UpdateCrewInviteExpirationTool,
	UpdateCrewLabelTool,
	UpdateCrewUserActiveTool,
	UpdateMintAnalyticsDateRangeTool,
	UpdateMintAnalyticsUnitsTool,
	UpdateMintAnalyticsIntervalTool,
	UpdateMintNameTool,
	UpdateMintDescriptionTool,
	UpdateMintIconUrlTool,
	UpdateMintDescriptionLongTool,
	UpdateMintMotdTool,
	AddMintUrlTool,
	UpdateMintUrlTool,
	RemoveMintUrlTool,
	AddMintContactTool,
	UpdateMintContactTool,
	RemoveMintContactTool,
	UpdateMintEnabledTool,
	UpdateMintQuoteTtlTool,
	UpdateMintMethodMinTool,
	UpdateMintMethodMaxTool,
	UpdateMintMethodDescriptionTool,
	UpdateMintKeysetStatusTool,
	UpdateMintKeysetRotationUnitTool,
	UpdateMintKeysetRotationInputFeePpkTool,
	UpdateMintKeysetRotationAmountsTool,
	UpdateMintDatabaseDataTypeTool,
	UpdateMintDatabaseStatesTool,
	UpdateMintBackupFilenameTool,
} from './ai.tools';

export const AI_AGENTS = {
	[AiAgent.DEFAULT]: {
		name: 'Orchard Agent',
		icon: 'spa',
		section: null,
		description: 'The general purpose agent',
		system_message: {
			role: 'system',
			content: 'You are a helpful assistant that can answer questions and help with tasks.',
		},
		tools: [],
	},
	[AiAgent.INDEX_CREW]: {
		name: 'Crew Agent',
		icon: 'spa',
		section: 'index',
		description: 'Control the filters of the crew table',
		system_message: {
			role: 'system',
			content:
				'You are an agent designed to help adjust parameters used to explore the users of the application and any open invites.',
		},
		tools: [UpdateSearchTool, UpdateCrewStatesTool, UpdateCrewRolesTool],
	},
	[AiAgent.INDEX_CREW_INVITE]: {
		name: 'Crew Invite Agent',
		icon: 'spa',
		section: 'index',
		description: 'Control the filters of the crew invite table',
		system_message: {
			role: 'system',
			content: `You are an agent designed to help configure crew invites.
				When the user asks you to make changes, you MUST immediately call the appropriate tool functions to apply those changes.
				Do not explain what you would do - actually execute the tool calls.
				You have access to these tools and should use them to fulfill user requests:
				- Update invite role
				- Update invite label
				- Update expiration enabled status
				- Update expiration date and time
				Always call the tools to make the requested changes, then briefly confirm what was done.`,
		},
		tools: [UpdateCrewInviteRoleTool, UpdateCrewLabelTool, UpdateCrewInviteExpirationEnabledTool, UpdateCrewInviteExpirationTool],
	},
	[AiAgent.INDEX_CREW_USER]: {
		name: 'Crew User Agent',
		icon: 'spa',
		section: 'index',
		description: 'Control user settings',
		system_message: {
			role: 'system',
			content: `You are an agent designed to help configure user settings.
				When the user asks you to make changes, you MUST immediately call the appropriate tool functions to apply those changes.
				Always call the tools to make the requested changes, then briefly confirm what was done.`,
		},
		tools: [UpdateCrewUserActiveTool, UpdateCrewInviteRoleTool, UpdateCrewLabelTool],
	},
	[AiAgent.MINT_DASHBOARD]: {
		name: 'Mint Dashboard Agent',
		icon: 'spa',
		section: 'mint',
		description: 'Control the filters of the mint analytics',
		system_message: {
			role: 'system',
			content: 'You are an agent designed to help adjust parameters used to explore mint analytics.',
		},
		tools: [UpdateMintAnalyticsDateRangeTool, UpdateMintAnalyticsUnitsTool, UpdateMintAnalyticsIntervalTool],
	},
	[AiAgent.MINT_INFO]: {
		name: 'Mint Info Agent',
		icon: 'spa',
		section: 'mint',
		description: 'Mint info agent',
		system_message: {
			role: 'system',
			content: `You are an agent designed to help manage, update, and configure the public information of a cashu mint.
            You will be provided with the current state of the form along with the users request for additions or changes`,
		},
		tools: [
			UpdateMintNameTool,
			UpdateMintDescriptionTool,
			UpdateMintIconUrlTool,
			UpdateMintDescriptionLongTool,
			UpdateMintMotdTool,
			AddMintUrlTool,
			UpdateMintUrlTool,
			RemoveMintUrlTool,
			AddMintContactTool,
			UpdateMintContactTool,
			RemoveMintContactTool,
		],
	},
	[AiAgent.MINT_CONFIG]: {
		name: 'Mint Config',
		icon: 'spa',
		section: 'mint',
		description: 'Mint config agent',
		system_message: {
			role: 'system',
			content: `You are an agent designed to help configure the operational parameters of a cashu mint.
            You will be provided with the current state of the form along with the users request for changes`,
		},
		tools: [
			UpdateMintEnabledTool,
			UpdateMintQuoteTtlTool,
			UpdateMintMethodMinTool,
			UpdateMintMethodMaxTool,
			UpdateMintMethodDescriptionTool,
		],
	},
	[AiAgent.MINT_KEYSETS]: {
		name: 'Mint Keysets',
		icon: 'spa',
		section: 'mint',
		description: 'Mint keysets agent',
		system_message: {
			role: 'system',
			content: `You are an agent designed to help explore data related to mint keysets.
            You will be provided with the current state of the form along with the users request for changes`,
		},
		tools: [UpdateMintAnalyticsDateRangeTool, UpdateMintAnalyticsUnitsTool, UpdateMintKeysetStatusTool],
	},
	[AiAgent.MINT_KEYSET_ROTATION]: {
		name: 'Mint Keyset Rotation',
		icon: 'spa',
		section: 'mint',
		description: 'Mint keyset rotation agent',
		system_message: {
			role: 'system',
			content: `You are an agent designed to help rotate keysets in a cashu mint.
            You will be provided with the current state of the form along with the users request for changes`,
		},
		tools: [UpdateMintKeysetRotationUnitTool, UpdateMintKeysetRotationInputFeePpkTool, UpdateMintKeysetRotationAmountsTool],
	},
	[AiAgent.MINT_DATABASE]: {
		name: 'Mint Database',
		icon: 'spa',
		section: 'mint',
		description: 'Mint database agent',
		system_message: {
			role: 'system',
			content: `You are an agent designed to help explore the database of a cashu mint.
            You will be provided with the current state of the form along with the users request for changes`,
		},
		tools: [
			UpdateMintAnalyticsDateRangeTool,
			UpdateMintAnalyticsUnitsTool,
			UpdateMintDatabaseDataTypeTool,
			UpdateMintDatabaseStatesTool,
		],
	},
	[AiAgent.MINT_BACKUP]: {
		name: 'Mint Backup',
		icon: 'spa',
		section: 'mint',
		description: 'Mint backup agent',
		system_message: {
			role: 'system',
			content: `You are an agent designed to help create database backups of a cashu mint.
            You will be provided with the current state of the form along with the users request for changes`,
		},
		tools: [UpdateMintBackupFilenameTool],
	},
};
