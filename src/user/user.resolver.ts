import {
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent,
  Mutation,
  Context,
} from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { Int } from "type-graphql";

import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";
import { CommentService } from "../comment/comment.service";
import { UserDTO } from "./dto/user.dto";
import { Auth } from "./Auth.response";
import { AuthGuard } from "../shared/auth.guard";

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly commentService: CommentService,
  ) {}

  @Query(() => [UserEntity])
  public async users(
    @Args({ name: "page", type: () => Int, nullable: true }) page?: number,
  ) {
    const users = await this.userService.showAll(page);

    return users;
  }

  @Query(() => UserEntity)
  public user(@Args("username") username: string) {
    return this.userService.read(username);
  }

  @Query(() => String)
  @UseGuards(new AuthGuard())
  public whoami(@Context("user") { username }) {
    return username;
  }

  @Mutation(() => Auth)
  public async login(@Args("input") input: UserDTO) {
    const response = await this.userService.login(input);

    return {
      token: response.token,
      username: response.user.username,
    };
  }

  @Mutation(() => Auth)
  public async register(@Args("input") input: UserDTO) {
    const response = await this.userService.register(input);

    return {
      username: response.username,
    };
  }

  @ResolveProperty("comments")
  public comments(@Parent() { id }) {
    return this.commentService.showByUser(id);
  }
}
