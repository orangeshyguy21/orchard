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
            usage {
                prompt_tokens
                completion_tokens
                total_duration
                eval_duration
            }
        }
    }
`;

export const AI_MODELS_QUERY = `
    query AiModels {
        ai_models{
            model
            name
            context_length
            ollama {
                modified_at
                size
                digest
                parent_model
                format
                family
                families
                parameter_size
                quantization_level
            }
            openrouter {
                pricing_prompt
                pricing_completion
                modality
                tokenizer
                max_completion_tokens
                family
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

export const AI_AGENTS_QUERY = `
    query AiAgents {
        ai_agents {
            id
            agent_key
            name
            description
            active
            system_message
            tools
            schedules
            last_run_at
            last_run_status
            created_at
            updated_at
        }
    }
`;

export const AI_AGENT_QUERY = `
    query AiAgent($id: String!) {
        ai_agent(id: $id) {
            id
            agent_key
            name
            description
            active
            system_message
            tools
            schedules
            last_run_at
            last_run_status
            created_at
            updated_at
        }
    }
`;

export const AI_AGENT_UPDATE_MUTATION = `
    mutation AiAgentUpdate($id: String!, $name: String, $description: String, $active: Boolean, $system_message: String, $tools: [String!], $schedules: [String!]) {
        ai_agent_update(id: $id, name: $name, description: $description, active: $active, system_message: $system_message, tools: $tools, schedules: $schedules) {
            id
            agent_key
            name
            description
            active
            system_message
            tools
            schedules
            last_run_at
            last_run_status
            created_at
            updated_at
        }
    }
`;
