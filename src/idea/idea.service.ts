import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { IdeaEntity } from "./idea.entity";
import { IdeaDTO } from "./dto/idea.dto";
import { UserEntity } from "../user/user.entity";

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private readonly ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  private toResponseObject(idea: IdeaEntity) {
    return {
      ...idea,
      author: idea.author
        ? {
            id: idea.author.id,
            username: idea.author.username,
            created: idea.author.created,
            updated: idea.author.created,
          }
        : null,
    };
  }

  private ensureOwnership(idea: IdeaEntity, userId: string) {
    if (idea.author.id !== userId) {
      throw new HttpException("Incorrect user", HttpStatus.UNAUTHORIZED);
    }
  }

  public async showAll() {
    const ideas = await this.ideaRepository.find({ relations: ["author"] });

    return ideas.map(idea => this.toResponseObject(idea));
  }

  public async create(data: IdeaDTO, userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const idea = await this.ideaRepository.create({ ...data, author: user });

    await this.ideaRepository.save(idea);

    return this.toResponseObject(idea);
  }

  public async read(id: string) {
    const idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ["author"],
    });

    if (!idea) {
      throw new HttpException("Not found", HttpStatus.NOT_FOUND);
    }

    return this.toResponseObject(idea);
  }

  public async update(id: string, data: Partial<IdeaDTO>, userId: string) {
    let idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ["author"],
    });

    if (!idea) {
      throw new HttpException("Not found", HttpStatus.NOT_FOUND);
    }

    this.ensureOwnership(idea, userId);

    await this.ideaRepository.update({ id }, data);

    // return the value updated
    idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ["author"],
    });

    return this.toResponseObject(idea);
  }

  public async destroy(id: string, userId: string) {
    const idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ["author"],
    });

    if (!idea) {
      throw new HttpException("Not found", HttpStatus.NOT_FOUND);
    }

    this.ensureOwnership(idea, userId);

    await this.ideaRepository.delete({ id });

    return this.toResponseObject(idea);
  }
}
