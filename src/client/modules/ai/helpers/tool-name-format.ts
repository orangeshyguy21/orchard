export function formatToolName(tool_name: string): string {
	return tool_name
		.split('_')
		.map(word => word.toLowerCase())
		.join(' ')
		.replace(/^\w/, c => c.toUpperCase());
}