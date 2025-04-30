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
    AddMintContactTool,
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
        ],
    },
};