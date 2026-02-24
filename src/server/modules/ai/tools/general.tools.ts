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

export const UpdateDateRangeTool = {
	type: 'function',
	function: {
		name: 'DATE_RANGE_UPDATE',
		description: `This tool allows you to update the date range.
        Use this when asked for the last x days of data, or the last x weeks of data, or the first week of May for example.`,
		parameters: {
			type: 'object',
			properties: {
				date_start: {
					type: 'string',
					description: 'The start date. You must provide the date in the format YYYY-MM-DD',
				},
				date_end: {
					type: 'string',
					description: 'The end date. You must provide the date in the format YYYY-MM-DD',
				},
			},
			required: ['date_start', 'date_end'],
		},
	},
};
