import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CommentEntity } from "./comment.entity";
import { IdeaEntity } from "../idea/idea.entity";
import { UserEntity } from "../user/user.entity";
import { CommentDTO } from "./dto/comment.dto";

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(IdeaEntity)
    private readonly ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  private toResponseObject(comment: CommentEntity) {
    const responseObject: any = {
      ...comment,
      author: comment.author
        ? {
            id: comment.author.id,
            username: comment.author.username,
            created: comment.author.created,
            updated: comment.author.created,
          }
        : null,
      idea: comment.idea
        ? {
            id: comment.idea.id,
            idea: comment.idea.idea,
            description: comment.idea.description,
            created: comment.idea.created,
            updated: comment.idea.updated,
          }
        : null,
    };

    return responseObject;
  }

  public async showByIdea(id: string) {
    const idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ["comments", "comments.author", "comments.idea"],
    });

    return idea.comments.map(comment => this.toResponseObject(comment));
  }

  public async showByUser(id: string) {
    const comments = await this.commentRepository.find({
      where: { author: { id } },
      relations: ["author"],
    });

    return comments.map(comment => this.toResponseObject(comment));
  }

  public async show(id: string) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ["author", "idea"],
    });

    return this.toResponseObject(comment);
  }

  public async create(ideaId: string, userId: string, data: CommentDTO) {
    const idea = await this.ideaRepository.findOne({ where: { id: ideaId } });
    const user = await this.userRepository.findOne({ where: { id: userId } });

    const comment = await this.commentRepository.create({
      ...data,
      idea,
      author: user,
    });

    await this.commentRepository.save(comment);

    return this.toResponseObject(comment);
  }

  public async destroy(id: string, userId: string) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ["author", "idea"],
    });

    if (comment.author.id !== userId) {
      throw new HttpException(
        "You do not own this comment",
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.commentRepository.remove(comment);

    return this.toResponseObject(comment);
  }
}
