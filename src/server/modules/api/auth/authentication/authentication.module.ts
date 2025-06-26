/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { ErrorModule } from "@server/modules/error/error.module";
import { AuthModule } from "@server/modules/auth/auth.module";
/* Internal Dependencies */
import { AuthenticationResolver } from "./authentication.resolver";
import { AuthenticationService } from "./authentication.service";

@Module({
	imports: [
		ErrorModule,
		AuthModule,
	],
	providers: [
		AuthenticationResolver,
		AuthenticationService,
	],
})
export class AuthenticationModule {}
