export type EnvConfig = {
	lines: {
		type: 'comment' | 'variable';
		key?: string;
		value: string;
	}[];
};
