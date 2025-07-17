/* Local Dependencies */
import { TargetOption } from './index-bitcoin-blockchain.component';

export const possible_options: TargetOption[] = [
	{
		target: 1,
		blocks: 1,
		blocks_label: 'Next block',
		time: '~10 minute',
	},
	{
		target: 3,
		blocks: 3,
		blocks_label: 'In 3 blocks',
		time: '~30 minute',
	},
	{
		target: 6,
		blocks: 6,
		blocks_label: 'In 6 blocks',
		time: '~60 minute',
	},
	{
		target: 12,
		blocks: 12,
		blocks_label: 'In 12 blocks',
		time: '~2 hours',
	},
	{
		target: 24,
		blocks: 24,
		blocks_label: 'In 24 blocks',
		time: '~4 hours',
	},
	{
		target: 72,
		blocks: 72,
		blocks_label: 'In 72 blocks',
		time: '~12 hours',
	},
	{
		target: 144,
		blocks: 144,
		blocks_label: 'In 144 blocks',
		time: '~1 day',
	},
	{
		target: 288,
		blocks: 288,
		blocks_label: 'In 288 blocks',
		time: '~2 days',
	},
	{
		target: 1008,
		blocks: 1008,
		blocks_label: 'In 1008 blocks',
		time: '~1 week',
	},	
];