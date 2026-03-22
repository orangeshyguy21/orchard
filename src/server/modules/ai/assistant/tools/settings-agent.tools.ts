export const UpdateAgentNameTool = {
	type: 'function',
	function: {
		name: 'AGENT_NAME_UPDATE',
		description: `Update the **name** of the agent.
- Max length: **64** characters`,
		parameters: {
			type: 'object',
			properties: {
				name: {
					type: 'string',
					description: 'The name of the agent',
				},
			},
			required: ['name'],
		},
	},
};

export const UpdateAgentDescriptionTool = {
	type: 'function',
	function: {
		name: 'AGENT_DESCRIPTION_UPDATE',
		description: `Update the **description** of the agent.
- Max length: **256** characters`,
		parameters: {
			type: 'object',
			properties: {
				description: {
					type: 'string',
					description: 'The description of the agent',
				},
			},
			required: ['description'],
		},
	},
};

export const UpdateAgentModelTool = {
	type: 'function',
	function: {
		name: 'AGENT_MODEL_UPDATE',
		description: `Update the **AI model** used by the agent.
- Must match a model from the **available models** list provided in context`,
		parameters: {
			type: 'object',
			properties: {
				model: {
					type: 'string',
					description: 'The model identifier',
				},
			},
			required: ['model'],
		},
	},
};

export const UpdateAgentSystemMessageTool = {
	type: 'function',
	function: {
		name: 'AGENT_SYSTEM_MESSAGE_UPDATE',
		description: `Update the **system prompt** that defines the agent's behavior.
- Max length: **4096** characters
- Write detailed, well-structured prompts that clearly define the agent's role, behavior, and constraints`,
		parameters: {
			type: 'object',
			properties: {
				system_message: {
					type: 'string',
					description: 'The system prompt for the agent',
				},
			},
			required: ['system_message'],
		},
	},
};

export const UpdateAgentToolsTool = {
	type: 'function',
	function: {
		name: 'AGENT_TOOLS_UPDATE',
		description: `Set the **tools** available to the agent.
- Tool names must **exactly match** names from the available tools list provided in context`,
		parameters: {
			type: 'object',
			properties: {
				tools: {
					type: 'array',
					items: {type: 'string'},
					description: 'Array of tool names to assign to the agent',
				},
			},
			required: ['tools'],
		},
	},
};

export const UpdateAgentSchedulesTool = {
	type: 'function',
	function: {
		name: 'AGENT_SCHEDULES_UPDATE',
		description: `Set the **cron schedules** for the agent.
- Format: standard cron expressions (e.g. \`0 */6 * * *\` for every 6 hours, \`0 0 * * *\` for daily at midnight)
- Minimum interval: **5 minutes**`,
		parameters: {
			type: 'object',
			properties: {
				schedules: {
					type: 'array',
					items: {type: 'string'},
					description: 'Array of cron expressions',
				},
			},
			required: ['schedules'],
		},
	},
};

export const UpdateAgentActiveTool = {
	type: 'function',
	function: {
		name: 'AGENT_ACTIVE_UPDATE',
		description: 'Toggle the agent **active** or **inactive**.',
		parameters: {
			type: 'object',
			properties: {
				active: {
					type: 'boolean',
					description: 'Whether the agent should be active',
				},
			},
			required: ['active'],
		},
	},
};
