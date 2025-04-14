/* Local Dependencies */
import { UpdateMintNameTool } from './ai.tools';
import { AiMessageRole, AiFunctionName } from './ai.enums';

export type AiModel = {
    name: string;
    model: string;
    modified_at: string;
    size: number;
    digest: string;
    details: AiModelDetails;
}   

export type AiModelDetails = {
    parent_model: string;
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
}   

export type AiMessage = {
    role: AiMessageRole;
    content: string;
    tool_calls?: AiToolCall[];
}

export type AiTool = {
    type: string;
    function: AiToolFunction;
}

export type AiToolFunction = {
    name: string;
    description: string;
    parameters: typeof UpdateMintNameTool['function']['parameters'];
}

export type AiToolCall = {
    function: {
        name: AiFunctionName;
        arguments:typeof UpdateMintNameTool['function']['parameters'];
    };
}