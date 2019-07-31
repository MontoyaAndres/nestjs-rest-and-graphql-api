import {
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent,
} from "@nestjs/graphql";
import { Int } from "type-graphql";

import { IdeaService } from "./idea.service";
import { IdeaEntity } from "./idea.entity";
import { CommentService } from "../comment/comment.service";

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

  @ResolveProperty("comments")
  public comments(@Parent() { id }) {
    return this.commentService.showByIdea(id);
  }
}
