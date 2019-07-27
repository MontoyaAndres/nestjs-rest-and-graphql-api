import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { IdeaEntity } from "./idea.entity";
import { IdeaDTO } from "./dto/idea.dto";

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
  ) {}

  public async showAll() {
    return await this.ideaRepository.find();
  }

  public async create(data: IdeaDTO) {
    const idea = await this.ideaRepository.create(data);
    await this.ideaRepository.save(idea);

    return idea;
  }

  public async read(id: string) {
    const idea = await this.ideaRepository.findOne({ where: { id } });

    if (!idea) {
      throw new HttpException("Not found", HttpStatus.NOT_FOUND);
    }

    return idea;
  }

  public async update(id: string, data: Partial<IdeaDTO>) {
    let idea = await this.ideaRepository.findOne({ where: { id } });

    if (!idea) {
      throw new HttpException("Not found", HttpStatus.NOT_FOUND);
    }

    await this.ideaRepository.update({ id }, data);

    // return the value updated
    idea = await this.ideaRepository.findOne({ where: { id } });

    return idea;
  }

  public async destroy(id: string) {
    const idea = await this.ideaRepository.findOne({ where: { id } });

    if (!idea) {
      throw new HttpException("Not found", HttpStatus.NOT_FOUND);
    }

    await this.ideaRepository.delete({ id });

    return idea;
  }
}
