/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Local Dependencies */
// Orchard Endpoints
import {StatusModule} from './status/status.module';
// Auth Endpoints
import {AuthInitializationModule} from './auth/initialization/initialization.module';
import {AuthAuthenticationModule} from './auth/authentication/authentication.module';
import {AuthSignupModule} from './auth/signup/authsignup.module';
// Bitcoin Endpoints
import {BitcoinNetworkModule} from './bitcoin/network/btcnetwork.module';
import {BitcoinBlockchainModule} from './bitcoin/blockchain/btcblockchain.module';
import {BitcoinBlockModule} from './bitcoin/block/btcblock.module';
import {BitcoinMempoolModule} from './bitcoin/mempool/btcmempool.module';
import {BitcoinTransactionModule} from './bitcoin/transaction/btctransaction.module';
import {BitcoinOracleModule} from './bitcoin/oracle/btcoracle.module';
// Lightning Endpoints
import {LightningInfoModule} from './lightning/info/lninfo.module';
import {LightningBalanceModule} from './lightning/balance/lnbalance.module';
import {LightningWalletModule} from './lightning/wallet/lnwallet.module';
import {LightningRequestModule} from './lightning/request/lnrequest.module';
import {LightningChannelModule} from './lightning/channel/lnchannel.module';
import {ApiLightningAnalyticsModule} from './lightning/analytics/lnanalytics.module';
// Taproot Assets Endpoints
import {TaprootAssetsInfoModule} from './tapass/info/tapinfo.module';
import {TaprootAssetsAssetModule} from './tapass/asset/tapasset.module';
// Cashu Mint Endpoints
import {MintInfoModule} from './mint/info/mintinfo.module';
import {MintBalanceModule} from './mint/balance/mintbalance.module';
import {MintKeysetModule} from './mint/keyset/mintkeyset.module';
import {MintDatabaseModule} from './mint/database/mintdatabase.module';
import {MintQuoteModule} from './mint/quote/mintquote.module';
import {MintMeltQuoteModule} from './mint/meltquote/mintmeltquote.module';
import {MintMintQuoteModule} from './mint/mintquote/mintmintquote.module';
import {MintPromiseModule} from './mint/promise/mintpromise.module';
import {MintProofModule} from './mint/proof/mintproof.module';
import {MintAnalyticsModule} from './mint/analytics/mintanalytics.module';
import {MintCountModule} from './mint/count/mintcount.module';
import {MintFeeModule} from './mint/fee/mintfee.module';
// AI Endpoints
import {AiModelModule} from './ai/model/aimodel.module';
import {AiAgentModule} from './ai/agent/aiagent.module';
import {AiChatModule} from './ai/chat/aichat.module';
// Image Endpoints
import {PublicImageModule} from './public/image/image.module';
import {PublicUrlModule} from './public/url/url.module';
import {PublicPortModule} from './public/port/port.module';
// Crew Endpoints
import {CrewUserModule} from './crew/crewuser/crewuser.module';
import {CrewInviteModule} from './crew/crewinvite/crewinvite.module';
// Setting Endpoints
import {ApiSettingModule} from './setting/setting.module';

@Module({
	imports: [
		StatusModule,
		AuthInitializationModule,
		AuthAuthenticationModule,
		AuthSignupModule,
		BitcoinNetworkModule,
		BitcoinBlockchainModule,
		BitcoinBlockModule,
		BitcoinMempoolModule,
		BitcoinTransactionModule,
		BitcoinOracleModule,
		LightningInfoModule,
		LightningBalanceModule,
		LightningWalletModule,
		LightningRequestModule,
		LightningChannelModule,
		ApiLightningAnalyticsModule,
		TaprootAssetsInfoModule,
		TaprootAssetsAssetModule,
		MintInfoModule,
		MintBalanceModule,
		MintKeysetModule,
		MintDatabaseModule,
		MintQuoteModule,
		MintMeltQuoteModule,
		MintMintQuoteModule,
		MintPromiseModule,
		MintProofModule,
		MintAnalyticsModule,
		MintCountModule,
		MintFeeModule,
		AiModelModule,
		AiAgentModule,
		AiChatModule,
		PublicImageModule,
		PublicUrlModule,
		PublicPortModule,
		CrewUserModule,
		CrewInviteModule,
		ApiSettingModule,
	],
})
export class ApiModule {}
