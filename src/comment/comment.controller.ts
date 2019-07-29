import {
  Controller,
  Get,
  Param,
  UseGuards,
  Post,
  Body,
  Delete,
} from "@nestjs/common";

import { CommentService } from "./comment.service";
import { AuthGuard } from "../shared/auth.guard";
import { User } from "../user/user.decorator";
import { CommentDTO } from "./dto/comment.dto";

@Controller("comments")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get("idea/:id")
  public showCommentsByIdea(@Param("id") idea: string) {
    return this.commentService.showByIdea(idea);
  }

  @Get("user/:id")
  public showCommentsByUser(@Param("id") user: string) {
    return this.commentService.showByUser(user);
  }

  @Post("idea/:id")
  @UseGuards(new AuthGuard())
  public createComment(
    @Param("id") idea: string,
    @User("id") user: string,
    @Body() data: CommentDTO,
  ) {
    return this.commentService.create(idea, user, data);
  }

  @Get(":id")
  public showComment(@Param("id") id: string) {
    return this.commentService.show(id);
  }

  @Delete(":id")
  @UseGuards(new AuthGuard())
  public destroyComment(@Param("id") id: string, @User("id") user: string) {
    return this.commentService.destroy(id, user);
  }
}
