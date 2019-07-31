import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserEntity } from "./user.entity";
import { UserResolver } from "./user.resolver";
import { CommentEntity } from "../comment/comment.entity";
import { CommentService } from "../comment/comment.service";
import { IdeaEntity } from "../idea/idea.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, IdeaEntity, CommentEntity])],
  controllers: [UserController],
  providers: [UserService, CommentService, UserResolver],
})
export class UserModule {}
