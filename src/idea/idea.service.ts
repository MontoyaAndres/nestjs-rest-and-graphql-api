import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { IdeaEntity } from "./idea.entity";
import { IdeaDIO } from "./dto/idea.dto";

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
  ) {}

  public async showAll() {
    return await this.ideaRepository.find();
  }

  public async create(data: IdeaDIO) {
    const idea = await this.ideaRepository.create(data);
    await this.ideaRepository.save(idea);

    return idea;
  }

  public async read(id: string) {
    return await this.ideaRepository.findOne({ where: { id } });
  }

  public async update(id: string, data: Partial<IdeaDIO>) {
    await this.ideaRepository.update({ id }, data);

    return await this.ideaRepository.findOne({ where: { id } });
  }

  public async destroy(id: string): Promise<boolean> {
    await this.ideaRepository.delete({ id });

    return true;
  }
}
