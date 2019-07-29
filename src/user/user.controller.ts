import { Controller, Post, Get, Body, UseGuards } from "@nestjs/common";

import { UserService } from "./user.service";
import { UserDTO } from "./dto/user.dto";
import { AuthGuard } from "../shared/auth.guard";
import { User } from "./user.decorator";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("users")
  @UseGuards(new AuthGuard())
  showAllusers(@User("id") user) {
    // tslint:disable-next-line: no-console
    console.log(user);
    return this.userService.showAll();
  }

  @Post("login")
  login(@Body() data: UserDTO) {
    return this.userService.login(data);
  }

  @Post("register")
  register(@Body() data: UserDTO) {
    return this.userService.register(data);
  }
}
