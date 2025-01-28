/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { StatusResolver } from "./status.resolver";
import { StatusService } from './status.service';

@Module({
  providers: [StatusResolver, StatusService],
})
export class StatusModule {}