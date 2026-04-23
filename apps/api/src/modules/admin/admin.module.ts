import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { BundleSearchModule } from "../bundle-search/bundle-search.module";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";

@Module({
  imports: [AuditModule, BundleSearchModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
