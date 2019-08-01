import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppGateway } from "../app.gateway";
import { IdeaController } from "./idea.controller";
import { IdeaService } from "./idea.service";
import { IdeaEntity } from "./idea.entity";
import { UserEntity } from "../user/user.entity";
import { IdeaResolver } from "./idea.resolver";
import { CommentEntity } from "../comment/comment.entity";
import { CommentService } from "../comment/comment.service";

@Module({
  imports: [TypeOrmModule.forFeature([IdeaEntity, UserEntity, CommentEntity])],
  controllers: [IdeaController],
  providers: [IdeaService, CommentService, IdeaResolver, AppGateway],
})
export class IdeaModule {}
