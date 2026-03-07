export const AI_CHAT_SUBSCRIPTION = `
    subscription AiChat($ai_chat: AiChatInput!) {
        ai_chat(ai_chat: $ai_chat) {
            message {
                role
                content
                thinking
                tool_calls {
                    function {
                        name
                        arguments
                    }
                }
            }
            model
            created_at
            done
            done_reason
            total_duration
            load_duration
            prompt_eval_count
            prompt_eval_duration
            eval_count
            eval_duration
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

export const AI_ASSISTANT_QUERY = `
    query AiAssistant($assistant: AiAssistant!) {
        ai_assistant(assistant: $assistant) {
            name
            description
            icon
            section
            system_message{
                content
                role
            }
            tools{
                type
                function{
                    name
                    description
                    parameters{
                        type
                        properties
                        required
                    }
                }
            }
        }
    }
`;

export const AI_HEALTH_QUERY = `
    query AiHealth {
        ai_health {
            message
            status
            vendor
        }
    }
`;

export const AI_CHAT_ABORT_MUTATION = `
    mutation AiChatAbort($id: String!) {
        ai_chat_abort(id: $id) {
            id
        }
    }
`;
