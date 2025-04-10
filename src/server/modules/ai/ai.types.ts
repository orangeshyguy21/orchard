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
    role: string;
    content: string;
}

export type AiTool = {
    type: string;
    function: AiToolFunction;
}

export type AiToolFunction = {
    name: string;
    description: string;
    parameters: any;
}