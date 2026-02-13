/* General Tools */
export const UpdateSearchTool = {
	type: 'function',
	function: {
		name: 'UPDATE_SEARCH',
		description: 'This tool allows you to update the search query.',
		parameters: {
			type: 'object',
			properties: {
				search: {
					type: 'string',
					description: 'The search query to update',
				},
			},
			required: ['search'],
		},
	},
};

/* Crew Tools */
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

/* Mint Dashboard Tools */
export const UpdateMintAnalyticsDateRangeTool = {
	type: 'function',
	function: {
		name: 'MINT_ANALYTICS_DATE_RANGE_UPDATE',
		description: `This tool allows you to update the date range over which the mint analytics are calculated.
        Use this when asked for the last x days of data, or the last x weeks of data, or the first week of May for example.`,
		parameters: {
			type: 'object',
			properties: {
				date_start: {
					type: 'string',
					description: 'The start date to calculate the mint analytics. You must provide the date in the format YYYY-MM-DD',
				},
				date_end: {
					type: 'string',
					description: 'The end date to calculate the mint analytics. You must provide the date in the format YYYY-MM-DD',
				},
			},
			required: ['date_start', 'date_end'],
		},
	},
};
export const UpdateMintAnalyticsUnitsTool = {
	type: 'function',
	function: {
		name: 'MINT_ANALYTICS_UNITS_UPDATE',
		description: 'This tool allows you to update the units displayed in the mint analytics.',
		parameters: {
			type: 'object',
			properties: {
				units: {
					type: 'array',
					description: 'The units of the mint analytics',
					items: {
						type: 'string',
						enum: ['sat', 'usd', 'eur'],
					},
				},
			},
			required: ['units'],
		},
	},
};
export const UpdateMintAnalyticsIntervalTool = {
	type: 'function',
	function: {
		name: 'MINT_ANALYTICS_INTERVAL_UPDATE',
		description:
			'This tool allows you to update the interval of the mint analytics. Only use this when asked to change the interval of the mint analytics.',
		parameters: {
			type: 'object',
			properties: {
				interval: {
					type: 'string',
					description: 'The interval of the mint analytics',
					enum: ['day', 'week', 'month'],
				},
			},
			required: ['interval'],
		},
	},
};
export const UpdateMintAnalyticsTypeTool = {
	type: 'function',
	function: {
		name: 'MINT_ANALYTICS_TYPE_UPDATE',
		description: 'This tool allows you to update the type of the mint analytics.',
		parameters: {
			type: 'object',
			properties: {
				type: {
					type: 'string',
					description: 'The type of the mint analytics',
					enum: ['summary', 'volume', 'operations'],
				},
			},
			required: ['type'],
		},
	},
};

/* Mint Info Tools */
export const UpdateMintNameTool = {
	type: 'function',
	function: {
		name: 'MINT_NAME_UPDATE',
		description: 'This tool allows you to update the name of the mint.',
		parameters: {
			type: 'object',
			properties: {
				name: {
					type: 'string',
					description: 'The name of the mint',
				},
			},
			required: ['name'],
		},
	},
};
export const UpdateMintDescriptionTool = {
	type: 'function',
	function: {
		name: 'MINT_DESCRIPTION_UPDATE',
		description: 'This tool allows you to update the description of the mint.',
		parameters: {
			type: 'object',
			properties: {
				description: {
					type: 'string',
					description: 'The description of the mint',
				},
			},
			required: ['description'],
		},
	},
};
export const UpdateMintIconUrlTool = {
	type: 'function',
	function: {
		name: 'MINT_ICON_URL_UPDATE',
		description: 'This tool allows you to update the icon url of the mint.',
		parameters: {
			type: 'object',
			properties: {
				icon_url: {
					type: 'string',
					description: 'The public url that contains the icon of the mint',
				},
			},
			required: ['icon_url'],
		},
	},
};
export const UpdateMintDescriptionLongTool = {
	type: 'function',
	function: {
		name: 'MINT_DESCRIPTION_LONG_UPDATE',
		description: 'This tool allows you to update the long description of the mint.',
		parameters: {
			type: 'object',
			properties: {
				description_long: {
					type: 'string',
					description: 'The long description of the mint',
				},
			},
			required: ['description_long'],
		},
	},
};
export const UpdateMintMotdTool = {
	type: 'function',
	function: {
		name: 'MINT_MOTD_UPDATE',
		description:
			'This tool allows you to update the message of the day of the mint. This is sometimes referred to as the "MOTD" or "Message of the Day". This is commonly used to update customers with important information about the mint.',
		parameters: {
			type: 'object',
			properties: {
				motd: {
					type: 'string',
					description: 'The message of the day of the mint',
				},
			},
			required: ['motd'],
		},
	},
};
export const AddMintUrlTool = {
	type: 'function',
	function: {
		name: 'MINT_URL_ADD',
		description: 'This tool allows you to add a new url used to access the mint.',
		parameters: {
			type: 'object',
			properties: {
				url: {
					type: 'string',
					description: 'The url of the mint',
				},
			},
			required: ['url'],
		},
	},
};
export const UpdateMintUrlTool = {
	type: 'function',
	function: {
		name: 'MINT_URL_UPDATE',
		description: 'This tool allows you to update one of the urls used to access the mint.',
		parameters: {
			type: 'object',
			properties: {
				old_url: {
					type: 'string',
					description: 'The mint url being updated',
				},
				url: {
					type: 'string',
					description: 'The new version of the url',
				},
			},
			required: ['old_url', 'url'],
		},
	},
};
export const RemoveMintUrlTool = {
	type: 'function',
	function: {
		name: 'MINT_URL_REMOVE',
		description: 'This tool allows you to remove one of the urls used to access the mint.',
		parameters: {
			type: 'object',
			properties: {
				url: {
					type: 'string',
					description: 'The url of the mint',
				},
			},
			required: ['url'],
		},
	},
};
export const AddMintContactTool = {
	type: 'function',
	function: {
		name: 'MINT_CONTACT_ADD',
		description: 'This tool allows you to add new contact information to the mint.',
		parameters: {
			type: 'object',
			properties: {
				method: {
					type: 'string',
					enum: ['email', 'nostr', 'twitter'],
					description: 'The method of contact',
				},
				info: {
					type: 'string',
					description: 'The information needed to contact the mint via the method specified',
				},
			},
			required: ['method', 'info'],
		},
	},
};
export const UpdateMintContactTool = {
	type: 'function',
	function: {
		name: 'MINT_CONTACT_UPDATE',
		description:
			'This tool allows you to update one of the contacts from the mint. You must provide the old method and info before the update.',
		parameters: {
			type: 'object',
			properties: {
				old_method: {
					type: 'string',
					enum: ['email', 'nostr', 'twitter'],
					description: 'The method of contact before the update',
				},
				old_info: {
					type: 'string',
					description: 'The information of the contact before the update',
				},
				method: {
					type: 'string',
					enum: ['email', 'nostr', 'twitter'],
					description: 'The new method of contact',
				},
				info: {
					type: 'string',
					description: 'The new information needed to contact the mint via the new method specified',
				},
			},
			required: ['old_method', 'old_info', 'method', 'info'],
		},
	},
};
export const RemoveMintContactTool = {
	type: 'function',
	function: {
		name: 'MINT_CONTACT_REMOVE',
		description: 'This tool allows you to remove one of the contacts from the mint.',
		parameters: {
			type: 'object',
			properties: {
				method: {
					type: 'string',
					enum: ['email', 'nostr', 'twitter'],
					description: 'The method of contact',
				},
				info: {
					type: 'string',
					description: 'The information needed to contact the mint via the method specified',
				},
			},
			required: ['method', 'info'],
		},
	},
};

export const UpdateMintEnabledTool = {
	type: 'function',
	function: {
		name: 'MINT_ENABLED_UPDATE',
		description: 'This tool allows you to update the enabled status of the minting and melting operations.',
		parameters: {
			type: 'object',
			properties: {
				enabled: {
					type: 'boolean',
					description: 'The enabled status of the chosen operation',
				},
				operation: {
					type: 'string',
					enum: ['minting', 'melting'],
					description: 'The operation to update the enabled status of',
				},
			},
			required: ['enabled', 'operation'],
		},
	},
};

export const UpdateMintQuoteTtlTool = {
	type: 'function',
	function: {
		name: 'MINT_QUOTE_TTL_UPDATE',
		description: 'This tool allows you to update quote ttls for the minting and melting operations.',
		parameters: {
			type: 'object',
			properties: {
				ttl: {
					type: 'number',
					description: 'The quote ttl of the mint in seconds',
				},
				operation: {
					type: 'string',
					enum: ['minting', 'melting'],
					description: 'The operation to update the quote ttl of',
				},
			},
			required: ['ttl', 'operation'],
		},
	},
};

export const UpdateMintMethodMinTool = {
	type: 'function',
	function: {
		name: 'MINT_METHOD_MIN_UPDATE',
		description: 'This tool allows you to update the minimum amount of a method for the minting and melting operations.',
		parameters: {
			type: 'object',
			properties: {
				min_amount: {
					type: 'number',
					description: 'The minimum amount of the method',
				},
				operation: {
					type: 'string',
					enum: ['minting', 'melting'],
					description: 'The operation to update the minimum amount of',
				},
				method: {
					type: 'string',
					enum: ['bolt11'],
					description: 'The method to update the minimum amount of',
				},
				unit: {
					type: 'string',
					enum: ['sat', 'usd', 'eur'],
					description: 'The unit of the method',
				},
			},
			required: ['min_amount', 'operation', 'method', 'unit'],
		},
	},
};

export const UpdateMintMethodMaxTool = {
	type: 'function',
	function: {
		name: 'MINT_METHOD_MAX_UPDATE',
		description: 'This tool allows you to update the maximum amount of a method for the minting and melting operations.',
		parameters: {
			type: 'object',
			properties: {
				max_amount: {
					type: 'number',
					description: 'The maximum amount of the method',
				},
				operation: {
					type: 'string',
					enum: ['minting', 'melting'],
					description: 'The operation to update the maximum amount of',
				},
				method: {
					type: 'string',
					enum: ['bolt11'],
					description: 'The method to update the maximum amount of',
				},
				unit: {
					type: 'string',
					enum: ['sat', 'usd', 'eur'],
					description: 'The unit of the method',
				},
			},
			required: ['max_amount', 'operation', 'method', 'unit'],
		},
	},
};

export const UpdateMintMethodDescriptionTool = {
	type: 'function',
	function: {
		name: 'MINT_METHOD_DESCRIPTION_UPDATE',
		description:
			'This tool allows you to update the boolean flag to signal support for descriptions in a specific minting method and unit.',
		parameters: {
			type: 'object',
			properties: {
				description: {
					type: 'boolean',
					description: 'The boolean flag to signal support for descriptions in a minting method',
				},
				method: {
					type: 'string',
					enum: ['bolt11'],
					description: 'The method to update the description status of',
				},
				unit: {
					type: 'string',
					enum: ['sat', 'usd', 'eur'],
					description: 'The unit of the method',
				},
			},
			required: ['description', 'method', 'unit'],
		},
	},
};

export const UpdateMintKeysetStatusTool = {
	type: 'function',
	function: {
		name: 'MINT_KEYSET_STATUS_UPDATE',
		description: 'This tool allows you to filter the keysets by status.',
		parameters: {
			type: 'object',
			properties: {
				statuses: {
					type: 'array',
					description: 'The status types of the keysets to filter by',
					items: {
						type: 'boolean',
						enum: ['true', 'false'],
					},
				},
			},
			required: ['statuses'],
		},
	},
};

export const UpdateMintKeysetRotationUnitTool = {
	type: 'function',
	function: {
		name: 'MINT_KEYSET_ROTATION_UNIT_UPDATE',
		description: 'This tool allows you to update the unit of the keyset rotation.',
		parameters: {
			type: 'object',
			properties: {
				unit: {
					type: 'string',
					enum: ['sat', 'usd', 'eur'],
					description: 'The unit of the method',
				},
			},
			required: ['unit'],
		},
	},
};
export const UpdateMintKeysetRotationInputFeePpkTool = {
	type: 'function',
	function: {
		name: 'MINT_KEYSET_ROTATION_INPUT_FEE_PPK_UPDATE',
		description: 'This tool allows you to update the input fee ppk of the keyset rotation.',
		parameters: {
			type: 'object',
			properties: {
				input_fee_ppk: {
					type: 'number',
					description: 'The input fee ppk of the keyset rotation',
				},
			},
			required: ['input_fee_ppk'],
		},
	},
};
export const UpdateMintKeysetRotationAmountsTool = {
	type: 'function',
	function: {
		name: 'MINT_KEYSET_ROTATION_AMOUNTS_UPDATE',
		description: 'This tool allows you to update the ecash denomination amounts of the keyset rotation.',
		parameters: {
			type: 'object',
			properties: {
				amounts: {
					type: 'array',
					items: {type: 'number'},
					description: 'The ecash denomination amounts for the keyset rotation',
				},
			},
			required: ['amounts'],
		},
	},
};

export const UpdateMintDatabaseDataTypeTool = {
	type: 'function',
	function: {
		name: 'MINT_DATABASE_DATA_TYPE_UPDATE',
		description: 'This tool allows you to change what type of data is being displayed.',
		parameters: {
			type: 'object',
			properties: {
				type: {
					type: 'string',
					enum: ['MintMints', 'MintMelts', 'MintProofGroups', 'MintPromiseGroups'],
					description:
						'The type of data to display. MintProofGroups is displayed as Ecash Used. MintPromiseGroups is displayed as Ecash Held.',
				},
			},
			required: ['type'],
		},
	},
};
export const UpdateMintDatabaseStatesTool = {
	type: 'function',
	function: {
		name: 'MINT_DATABASE_STATES_UPDATE',
		description: 'This tool allows you to change what states are being displayed for the selected data type.',
		parameters: {
			type: 'object',
			properties: {
				states: {
					type: 'array',
					description:
						'The states to display for the selected data type. The valid states for MintMints are: ISSUED, PAID, PENDING, UNPAID. The valid states for MintMelts are: PAID, PENDING, UNPAID. The valid states for MintProofGroups are: SPENT. MintPromiseGroups has no states.',
					items: {
						type: 'string',
						enum: ['ISSUED', 'PAID', 'PENDING', 'UNPAID', 'SPENT'],
					},
				},
			},
			required: ['states'],
		},
	},
};
export const UpdateMintBackupFilenameTool = {
	type: 'function',
	function: {
		name: 'MINT_BACKUP_FILENAME_UPDATE',
		description: 'This tool allows you to update the filename of the backup.',
		parameters: {
			type: 'object',
			properties: {
				filename: {
					type: 'string',
					description: 'The filename of the backup',
				},
			},
		},
	},
};
