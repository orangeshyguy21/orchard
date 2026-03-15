/* Core Dependencies */
import {Injectable} from '@nestjs/common';
/* Application Dependencies */
import {
	GetBitcoinAnalyticsMetricsTool,
	GetBitcoinBlockchainInfoTool,
	GetBitcoinNetworkInfoTool,
	GetLightningAnalyticsBalancesTool,
	GetLightningAnalyticsMetricsTool,
	GetLightningChannelsTool,
	GetLightningClosedChannelsTool,
	GetLightningInfoTool,
	GetLightningPeersTool,
	GetMintAnalyticsMetricsTool,
	GetMintAnalyticsTool,
	GetMintInfoTool,
	GetPastRunsTool,
	GetPortHealthTool,
	GetSystemMetricsTool,
	GetUrlHealthTool,
	createSendMessageTool,
} from '@server/modules/ai/agent/tools';
import {AiToolEntry} from '@server/modules/ai/tools/tool.types';
/* Local Dependencies */
import {OrchardAgentTool} from './aitools.model';

/** All registered agent tools */
const ALL_TOOLS: AiToolEntry[] = [
	GetBitcoinAnalyticsMetricsTool,
	GetBitcoinBlockchainInfoTool,
	GetBitcoinNetworkInfoTool,
	GetLightningAnalyticsBalancesTool,
	GetLightningAnalyticsMetricsTool,
	GetLightningChannelsTool,
	GetLightningClosedChannelsTool,
	GetLightningInfoTool,
	GetLightningPeersTool,
	GetMintAnalyticsMetricsTool,
	GetMintAnalyticsTool,
	GetMintInfoTool,
	GetPastRunsTool,
	GetPortHealthTool,
	GetSystemMetricsTool,
	GetUrlHealthTool,
	createSendMessageTool(),
];

@Injectable()
export class AiToolsService {
	/** Returns metadata for all registered agent tools */
	getTools(): OrchardAgentTool[] {
		return ALL_TOOLS.map((entry) => new OrchardAgentTool(entry));
	}
}
