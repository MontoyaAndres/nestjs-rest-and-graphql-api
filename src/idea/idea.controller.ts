import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from "@nestjs/common";

import { IdeaService } from "./idea.service";
import { IdeaDTO } from "./dto/idea.dto";
import { AuthGuard } from "../shared/auth.guard";
import { User } from "../user/user.decorator";

@Controller("idea")
export class IdeaController {
  constructor(private readonly ideaService: IdeaService) {}

  @Get()
  public showAllIdeas(@Query("page") page: number) {
    return this.ideaService.showAll(page);
  }

  @Get("/newest")
  public showNewestIdeas(@Query("page") page: number) {
    return this.ideaService.showAll(page, true);
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
  public deleteIdea(@Param("id") id: string, @User("id") user: string) {
    return this.ideaService.destroy(id, user);
  }

  @Post(":id/upvote")
  @UseGuards(new AuthGuard())
  public upvoteIdea(@Param("id") id: string, @User("id") user: string) {
    return this.ideaService.upvote(id, user);
  }

  @Post(":id/downvote")
  @UseGuards(new AuthGuard())
  public downvoteIdea(@Param("id") id: string, @User("id") user: string) {
    return this.ideaService.downvote(id, user);
  }

  @Post(":id/bookmark")
  @UseGuards(new AuthGuard())
  public bookmarkIdea(@Param("id") id: string, @User("id") user: string) {
    return this.ideaService.bookmark(id, user);
  }

  @Delete(":id/bookmark")
  @UseGuards(new AuthGuard())
  public unbookmarkIdea(@Param("id") id: string, @User("id") user: string) {
    return this.ideaService.unbookmark(id, user);
  }
}
