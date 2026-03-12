export const UpdateCrewStatesTool = {
	type: 'function',
	function: {
		name: 'CREW_STATES_UPDATE',
		description: 'This tool allows you to update the states of the crew.',
		parameters: {
			type: 'object',
			properties: {
				states: {
					type: 'array',
					description: 'The states of the crew',
					items: {
						type: 'string',
						enum: ['ACTIVE', 'INACTIVE', 'PENDING'],
					},
				},
			},
			required: ['states'],
		},
	},
};

export const UpdateCrewRolesTool = {
	type: 'function',
	function: {
		name: 'CREW_ROLES_UPDATE',
		description: 'This tool allows you to update the roles of the crew.',
		parameters: {
			type: 'object',
			properties: {
				roles: {
					type: 'array',
					description: 'The roles of the crew',
					items: {
						type: 'string',
						enum: ['ADMIN', 'MANAGER', 'READER'],
					},
				},
			},
			required: ['roles'],
		},
	},
};

export const UpdateCrewInviteRoleTool = {
	type: 'function',
	function: {
		name: 'INVITE_ROLE_UPDATE',
		description: 'This tool allows you to update the role of the invite or user.',
		parameters: {
			type: 'object',
			properties: {
				role: {
					type: 'string',
					enum: ['MANAGER', 'READER'],
					description: 'The role of the invite or user',
				},
			},
			required: ['role'],
		},
	},
};

export const UpdateCrewInviteExpirationEnabledTool = {
	type: 'function',
	function: {
		name: 'CREW_INVITE_EXPIRATION_ENABLED_UPDATE',
		description: `This tool controls whether the invite has an expiration date.
        Set to true if the invite should expire at a specific date/time.
        Set to false if the invite should never expire (permanent invite).
        Use this when the user wants to make an invite permanent or add an expiration.`,
		parameters: {
			type: 'object',
			properties: {
				expiration_enabled: {
					type: 'boolean',
					description: 'Set to false for permanent invite (never expires), true to enable expiration',
				},
			},
			required: ['expiration_enabled'],
		},
	},
};

export const UpdateCrewInviteExpirationTool = {
	type: 'function',
	function: {
		name: 'CREW_INVITE_EXPIRATION_UPDATE',
		description: `This tool allows you to update the expiration date and time for the crew invite.
        The expiration_datetime should be provided as an ISO 8601 datetime string (e.g., "2025-11-15T14:30:00").
        Use this when the user specifies when the invite should expire, like "tomorrow at 3pm" or "in 8 hours".`,
		parameters: {
			type: 'object',
			properties: {
				expiration_datetime: {
					type: 'string',
					description: 'The expiration date and time in ISO 8601 format (YYYY-MM-DDTHH:mm:ss). Example: "2025-11-15T14:30:00"',
				},
			},
			required: ['expiration_datetime'],
		},
	},
};

export const UpdateCrewLabelTool = {
	type: 'function',
	function: {
		name: 'CREW_LABEL_UPDATE',
		description: 'This tool allows you to update the label of the crew.',
		parameters: {
			type: 'object',
			properties: {
				label: {
					type: 'string',
					description: 'The label of the crew',
				},
			},
			required: ['label'],
		},
	},
};

export const UpdateCrewUserActiveTool = {
	type: 'function',
	function: {
		name: 'CREW_USER_ACTIVE_UPDATE',
		description: `This tool allows you to update the active status of a user.
        Set to true to activate the user (they can access the system).
        Set to false to deactivate the user (they cannot access the system).
        Use this when the user wants to enable, disable, activate, or deactivate a user account.`,
		parameters: {
			type: 'object',
			properties: {
				active: {
					type: 'boolean',
					description: 'Set to true to activate the user, false to deactivate the user',
				},
			},
			required: ['active'],
		},
	},
};
