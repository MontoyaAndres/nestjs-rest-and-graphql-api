import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from "@nestjs/common";

import { IdeaService } from "./idea.service";
import { IdeaDIO } from "./dto/idea.dto";

@Controller("idea")
export class IdeaController {
  constructor(private readonly ideaService: IdeaService) {}

  @Get()
  public showAllIdeas() {
    return this.ideaService.showAll();
  }

  @Post()
  public createIdea(@Body() data: IdeaDIO) {
    return this.ideaService.create(data);
  }

  @Get(":id")
  public readIdea(@Param("id") id: string) {
    return this.ideaService.read(id);
  }

  @Put(":id")
  public updateIdea(@Param("id") id: string, @Body() data: Partial<IdeaDIO>) {
    return this.ideaService.update(id, data);
  }

  @Delete(":id")
  public deleteIdea(@Param("id") id: string) {
    return this.ideaService.destroy(id);
  }
}
