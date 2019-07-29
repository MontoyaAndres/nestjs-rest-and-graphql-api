import { Resolver, Query } from "@nestjs/graphql";

import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserEntity])
  public async users() {
    const users = await this.userService.showAll();

    return users;
  }
}
