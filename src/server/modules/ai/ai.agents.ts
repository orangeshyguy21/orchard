/* Local Dependencies */
import { AiAgent } from "./ai.enums";
import { 
    UpdateMintNameTool,
    UpdateMintDescriptionTool, 
    UpdateMintIconUrlTool, 
    UpdateMintDescriptionLongTool,
    UpdateMintMotdTool, 
    AddMintUrlTool,
    UpdateMintUrlTool,
    RemoveMintUrlTool,
} from "./ai.tools";

export const AI_AGENTS = {
    [AiAgent.DEFAULT]: {
        name: 'Default',
        description: 'Default agent',
        system_message: {
            role: 'system',
            content: 'You are a helpful assistant that can answer questions and help with tasks.',
        },
        tools: [],
    },
    [AiAgent.MINT_INFO]: {
        name: 'Mint Info',
        description: 'Mint info agent',
        system_message: {
            role: 'system',
            content: 'You are a helpful assistant that can answer questions and help with tasks.',
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
        ],
    },
};