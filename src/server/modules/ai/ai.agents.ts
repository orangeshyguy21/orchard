/* Local Dependencies */
import { AiAgent } from "./ai.enums";
import { 
    UpdateMintAnalyticsDateRangeTool,
    UpdateMintAnalyticsUnitsTool,
    UpdateMintAnalyticsIntervalTool,
    UpdateMintAnalyticsTypeTool,
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
    UpdateMintKeysetRotationMaxOrderTool,
    UpdateMintDatabaseDataTypeTool,
    UpdateMintDatabaseStatesTool,
    UpdateMintBackupFilenameTool,
} from "./ai.tools";

export const AI_AGENTS = {
    [AiAgent.DEFAULT]: {
        name: 'Orchard Agent',
        icon: 'help',
        section: null,
        description: 'The general purpose agent',
        system_message: {
            role: 'system',
            content: 'You are a helpful assistant that can answer questions and help with tasks.',
        },
        tools: [],
    },
    [AiAgent.MINT_DASHBOARD]: {
        name: 'Mint Dashboard Agent',
        icon: 'account_balance',
        section: 'mint',
        description: 'Control the filters of the mint analytics',
        system_message: {
            role: 'system',
            content: 'You are an agent designed to help adjust parameters used to explore mint analytics.',
        },
        tools: [
            UpdateMintAnalyticsDateRangeTool,
            UpdateMintAnalyticsUnitsTool,
            UpdateMintAnalyticsIntervalTool,
            UpdateMintAnalyticsTypeTool,
        ],
    },
    [AiAgent.MINT_INFO]: {
        name: 'Mint Info',
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
        description: 'Mint keysets agent',
        system_message: {
            role: 'system',
            content: `You are an agent designed to help explore data related to mint keysets.
            You will be provided with the current state of the form along with the users request for changes`,
        },
        tools: [
            UpdateMintAnalyticsDateRangeTool,
            UpdateMintAnalyticsUnitsTool,
            UpdateMintKeysetStatusTool,
        ],
    },
    [AiAgent.MINT_KEYSET_ROTATION]: {
        name: 'Mint Keyset Rotation',
        description: 'Mint keyset rotation agent',
        system_message: {
            role: 'system',
            content: `You are an agent designed to help rotate keysets in a cashu mint.
            You will be provided with the current state of the form along with the users request for changes`,
        },
        tools: [
            UpdateMintKeysetRotationUnitTool,
            UpdateMintKeysetRotationInputFeePpkTool,
            UpdateMintKeysetRotationMaxOrderTool,
        ],
    },
    [AiAgent.MINT_DATABASE]: {
        name: 'Mint Database',
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
        description: 'Mint backup agent',
        system_message: {
            role: 'system',
            content: `You are an agent designed to help create database backups of a cashu mint.
            You will be provided with the current state of the form along with the users request for changes`,
        },
        tools: [
            UpdateMintBackupFilenameTool,
        ],
    },
};