import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";

import { IdeaService } from "./idea.service";
import { IdeaDTO } from "./dto/idea.dto";
import { AuthGuard } from "../shared/auth.guard";
import { User } from "../user/user.decorator";

@Controller("idea")
export class IdeaController {
  constructor(private readonly ideaService: IdeaService) {}

  @Get()
  public showAllIdeas() {
    return this.ideaService.showAll();
  }

  @Post()
  @UseGuards(new AuthGuard())
  public createIdea(@Body() data: IdeaDTO, @User("id") user) {
    return this.ideaService.create(data, user);
  }

  @Get(":id")
  public readIdea(@Param("id") id: string) {
    return this.ideaService.read(id);
  }

  @Put(":id")
  @UseGuards(new AuthGuard())
  public updateIdea(
    @Param("id") id: string,
    @Body() data: Partial<IdeaDTO>,
    @User("id") user,
  ) {
    return this.ideaService.update(id, data, user);
  }

  @Delete(":id")
  @UseGuards(new AuthGuard())
  public deleteIdea(@Param("id") id: string, @User("id") user) {
    return this.ideaService.destroy(id, user);
  }
}
