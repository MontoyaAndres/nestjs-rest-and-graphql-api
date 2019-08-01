import { Resolver, Query, Args, Mutation, Context } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";

import { CommentEntity } from "./comment.entity";
import { CommentService } from "./comment.service";
import { CommentDTO } from "./dto/comment.dto";
import { AuthGuard } from "../shared/auth.guard";

@Resolver()
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Query(() => CommentEntity)
  public comment(@Args("id") id: string) {
    return this.commentService.show(id);
  }

  @Mutation(() => CommentEntity)
  @UseGuards(new AuthGuard())
  public createComment(
    @Args("ideaId") ideaId: string,
    @Args("comment") comment: CommentDTO,
    @Context("user") { id: userId },
  ) {
    return this.commentService.create(ideaId, userId, comment);
  }

  @Mutation(() => CommentEntity)
  @UseGuards(new AuthGuard())
  public deleteComment(
    @Args("id") id: string,
    @Context("user") { id: userId },
  ) {
    return this.commentService.destroy(id, userId);
  }
}
