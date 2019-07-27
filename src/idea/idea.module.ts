import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { IdeaController } from "./idea.controller";
import { IdeaService } from "./idea.service";
import { IdeaEntity } from "./idea.entity";

@Module({
  imports: [TypeOrmModule.forFeature([IdeaEntity])],
  controllers: [IdeaController],
  providers: [IdeaService],
})
export class IdeaModule {}
