export const UpdateEventLogSectionsTool = {
	type: 'function',
	function: {
		name: 'EVENT_LOG_SECTIONS_UPDATE',
		description: 'This tool allows you to filter event logs by section. Use an empty array to show all sections.',
		parameters: {
			type: 'object',
			properties: {
				sections: {
					type: 'array',
					description: 'The sections to filter event logs by',
					items: {
						type: 'string',
						enum: ['BITCOIN', 'LIGHTNING', 'MINT', 'ECASH', 'AI', 'SETTINGS'],
					},
				},
			},
			required: ['sections'],
		},
	},
};

export const UpdateEventLogTypesTool = {
	type: 'function',
	function: {
		name: 'EVENT_LOG_TYPES_UPDATE',
		description: 'This tool allows you to filter event logs by action type. Use an empty array to show all types.',
		parameters: {
			type: 'object',
			properties: {
				types: {
					type: 'array',
					description: 'The action types to filter event logs by',
					items: {
						type: 'string',
						enum: ['CREATE', 'UPDATE', 'DELETE', 'EXECUTE'],
					},
				},
			},
			required: ['types'],
		},
	},
};

export const UpdateEventLogStatusesTool = {
	type: 'function',
	function: {
		name: 'EVENT_LOG_STATUSES_UPDATE',
		description: 'This tool allows you to filter event logs by status. Use an empty array to show all statuses.',
		parameters: {
			type: 'object',
			properties: {
				statuses: {
					type: 'array',
					description: 'The statuses to filter event logs by',
					items: {
						type: 'string',
						enum: ['SUCCESS', 'PARTIAL', 'ERROR'],
					},
				},
			},
			required: ['statuses'],
		},
	},
};

export const UpdateEventLogActorIdsTool = {
	type: 'function',
	function: {
		name: 'EVENT_LOG_ACTOR_IDS_UPDATE',
		description:
			'This tool allows you to filter event logs by actor (user). You will be provided with the available users and their IDs in the form context. Use an empty array to show events from all actors.',
		parameters: {
			type: 'object',
			properties: {
				actor_ids: {
					type: 'array',
					description: 'The user IDs to filter event logs by',
					items: {
						type: 'string',
					},
				},
			},
			required: ['actor_ids'],
		},
	},
};

export const ResetEventLogFiltersTool = {
	type: 'function',
	function: {
		name: 'EVENT_LOG_RESET_FILTERS',
		description: 'This tool resets all event log filters (sections, types, statuses) back to their defaults, showing all events.',
		parameters: {
			type: 'object',
			properties: {},
			required: [],
		},
	},
};
