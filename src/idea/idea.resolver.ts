import {
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent,
  Mutation,
  Context,
} from "@nestjs/graphql";
import { Int } from "type-graphql";
import { UseGuards } from "@nestjs/common";

import { IdeaService } from "./idea.service";
import { IdeaEntity } from "./idea.entity";
import { CommentService } from "../comment/comment.service";
import { IdeaDTO, IdeaUpdateDTO } from "./dto/idea.dto";
import { AuthGuard } from "../shared/auth.guard";
import { UserEntity } from "../user/user.entity";

@Resolver(() => IdeaEntity)
export class IdeaResolver {
  constructor(
    private readonly ideaService: IdeaService,
    private readonly commentService: CommentService,
  ) {}

  @Query(() => [IdeaEntity])
  public ideas(
    @Args({ name: "page", type: () => Int, nullable: true }) page?: number,
    @Args({ name: "newest", type: () => Boolean, nullable: true })
    newest?: boolean,
  ) {
    return this.ideaService.showAll(page, newest);
  }

  @Query(() => IdeaEntity)
  public idea(@Args("id") id: string) {
    return this.ideaService.read(id);
  }

  @Mutation(() => IdeaEntity)
  @UseGuards(new AuthGuard())
  public createIdea(
    @Args("input") input: IdeaDTO,
    @Context("user") { id: userId },
  ) {
    return this.ideaService.create(input, userId);
  }

  @Mutation(() => IdeaEntity)
  @UseGuards(new AuthGuard())
  public updateIdea(
    @Args("id") id: string,
    @Args("input") input: IdeaUpdateDTO,
    @Context("user") { id: userId },
  ) {
    return this.ideaService.update(id, input, userId);
  }

  @Mutation(() => IdeaEntity)
  @UseGuards(new AuthGuard())
  public deleteIdea(@Args("id") id: string, @Context("user") { id: userId }) {
    return this.ideaService.destroy(id, userId);
  }

  @Mutation(() => IdeaEntity)
  @UseGuards(new AuthGuard())
  public upvote(@Args("id") id: string, @Context("user") { id: userId }) {
    return this.ideaService.upvote(id, userId);
  }

  @Mutation(() => IdeaEntity)
  @UseGuards(new AuthGuard())
  public downvote(@Args("id") id: string, @Context("user") { id: userId }) {
    return this.ideaService.downvote(id, userId);
  }

  @Mutation(() => UserEntity)
  @UseGuards(new AuthGuard())
  public bookmark(@Args("id") id: string, @Context("user") { id: userId }) {
    return this.ideaService.bookmark(id, userId);
  }

  @Mutation(() => UserEntity)
  @UseGuards(new AuthGuard())
  public unbookmark(@Args("id") id: string, @Context("user") { id: userId }) {
    return this.ideaService.unbookmark(id, userId);
  }

  @ResolveProperty("comments")
  public comments(@Parent() { id }) {
    return this.commentService.showByIdea(id);
  }
}
