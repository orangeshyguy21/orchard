/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { ErrorModule } from "@server/modules/error/error.module";
import { AuthModule } from "@server/modules/auth/auth.module";
/* Internal Dependencies */
import { AuthLoginResolver } from "./authlogin.resolver";
import { AuthLoginService } from "./authlogin.service";

@Module({
	imports: [
		ErrorModule,
		AuthModule,
	],
	providers: [
		AuthLoginResolver,
		AuthLoginService,
	],
})
export class AuthLoginModule {}
