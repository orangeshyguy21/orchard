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

const AI_AGENT_FIELDS = `
    id
    agent_key
    name
    description
    active
    model
    system_message
    tools
    schedules
    schedule_kind
    schedule_tz
    last_run_at
    last_run_status
    created_at
    updated_at
`;

export const AI_AGENT_TOOLS_QUERY = `
    query AiAgentTools {
        ai_agent_tools {
            name
            title
            description
            category
            role
            throttle_max_calls
            throttle_window_seconds
        }
    }
`;

export const AI_AGENT_DEFAULTS_QUERY = `
    query AiAgentDefaults($agent_key: AgentKey!) {
        ai_agent_defaults(agent_key: $agent_key) {
            agent_key
            system_message
            tools
        }
    }
`;

export const AI_AGENTS_QUERY = `
    query AiAgents {
        ai_agents { ${AI_AGENT_FIELDS} }
    }
`;

export const AI_AGENT_QUERY = `
    query AiAgent($id: String!) {
        ai_agent(id: $id) { ${AI_AGENT_FIELDS} }
    }
`;

export const AI_AGENT_CREATE_MUTATION = `
    mutation AiAgentCreate($name: String!, $description: String, $active: Boolean, $model: String, $system_message: String, $tools: [String!], $schedules: [String!], $schedule_tz: Timezone) {
        ai_agent_create(name: $name, description: $description, active: $active, model: $model, system_message: $system_message, tools: $tools, schedules: $schedules, schedule_tz: $schedule_tz) { ${AI_AGENT_FIELDS} }
    }
`;

export const AI_AGENT_UPDATE_MUTATION = `
    mutation AiAgentUpdate($id: String!, $name: String, $description: String, $active: Boolean, $model: String, $system_message: String, $tools: [String!], $schedules: [String!], $schedule_tz: Timezone) {
        ai_agent_update(id: $id, name: $name, description: $description, active: $active, model: $model, system_message: $system_message, tools: $tools, schedules: $schedules, schedule_tz: $schedule_tz) { ${AI_AGENT_FIELDS} }
    }
`;

export const AI_AGENT_DELETE_MUTATION = `
    mutation AiAgentDelete($id: String!) {
        ai_agent_delete(id: $id)
    }
`;

export const AI_AGENT_EXECUTE_MUTATION = `
    mutation AiAgentExecute($id: String!) {
        ai_agent_execute(id: $id) {
            id
            status
            result
            error
            tokens_used
            started_at
            completed_at
            notified
        }
    }
`;

/** GQL type map for building dynamic variable definitions */
const GQL_TYPE_MAP: Record<string, string> = {
	name: 'String',
	description: 'String',
	active: 'Boolean',
	model: 'String',
	system_message: 'String',
	tools: '[String!]',
	schedules: '[String!]',
	schedule_tz: 'Timezone',
};

/** Builds a dynamic batch mutation for updating multiple agents in a single request */
export function buildAgentBatchMutation(
	agents: {id: string; updates: Record<string, unknown>}[],
): {query: string; variables: Record<string, unknown>} {
	const variable_defs: string[] = [];
	const mutations: string[] = [];
	const variables: Record<string, unknown> = {};

	agents.forEach((agent, index) => {
		const prefix = `a${index}`;
		variable_defs.push(`$${prefix}_id: String!`);
		variables[`${prefix}_id`] = agent.id;

		const args: string[] = [`id: $${prefix}_id`];
		for (const [key, value] of Object.entries(agent.updates)) {
			const var_name = `${prefix}_${key}`;
			const gql_type = GQL_TYPE_MAP[key] ?? 'String';
			variable_defs.push(`$${var_name}: ${gql_type}`);
			variables[var_name] = value;
			args.push(`${key}: $${var_name}`);
		}

		mutations.push(`${prefix}: ai_agent_update(${args.join(', ')}) { ${AI_AGENT_FIELDS} }`);
	});

	const query = `mutation AgentBatchUpdate(${variable_defs.join(', ')}) { ${mutations.join(' ')} }`;
	return {query, variables};
}
