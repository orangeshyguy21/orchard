export const AI_CHAT_SUBSCRIPTION = `
    subscription AiChat($ai_chat: AiChatInput!) {
        ai_chat(ai_chat: $ai_chat) {
            model
            message {
                role
                content
                tool_calls {
                    function {
                        name
                        arguments
                    }
                }
            }
            done
            done_reason
        }
    }
`;

export const AI_MODELS_QUERY = `
    query AiModels {
        ai_models{
            model
            modified_at
            name
            size
            digest
            details{
                family
                families
                format
                parameter_size
                parent_model
                quantization_level
            }
        }
    }
`;