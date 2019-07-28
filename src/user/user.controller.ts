import { Controller, Post, Get, Body } from "@nestjs/common";

import { UserService } from "./user.service";
import { UserDTO } from "./dto/user.dto";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("users")
  showAllusers() {
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
