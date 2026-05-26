import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { CategoriesModule } from "../categories/categories.module";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";

@Module({
  imports: [AuditModule, CategoriesModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
