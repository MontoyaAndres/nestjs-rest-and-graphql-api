import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { IdeaEntity } from "./idea.entity";
import { IdeaDTO } from "./dto/idea.dto";
import { UserEntity } from "../user/user.entity";
import { Votes } from "../shared/votes.enum";

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private readonly ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  private toResponseObject(idea: IdeaEntity) {
    const responseObject: any = {
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

    if (responseObject.upvotes) {
      responseObject.upvotes = idea.upvotes.length;
    }

    if (responseObject.downvotes) {
      responseObject.downvotes = idea.downvotes.length;
    }

    return responseObject;
  }

  private ensureOwnership(idea: IdeaEntity, userId: string) {
    if (idea.author.id !== userId) {
      throw new HttpException("Incorrect user", HttpStatus.UNAUTHORIZED);
    }
  }

  private async vote(idea: IdeaEntity, user: UserEntity, vote: Votes) {
    const opposite = vote === Votes.UP ? Votes.DOWN : Votes.UP;

    if (
      idea[opposite].some(voter => voter.id === user.id) ||
      idea[vote].some(voter => voter.id === user.id)
    ) {
      idea[opposite] = idea[opposite].filter(voter => voter.id !== user.id);
      idea[vote] = idea[vote].filter(voter => voter.id !== user.id);

      await this.ideaRepository.save(idea);
    } else if (!idea[vote].some(voter => voter.id === user.id)) {
      idea[vote].push(user);

      await this.ideaRepository.save(idea);
    } else {
      throw new HttpException("Unable to cast vote", HttpStatus.BAD_REQUEST);
    }

    return idea;
  }

  public async showAll() {
    const ideas = await this.ideaRepository.find({
      relations: ["author", "upvotes", "downvotes"],
    });

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
      relations: ["author", "upvotes", "downvotes"],
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

  public async upvote(id: string, userId: string) {
    let idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ["author", "upvotes", "downvotes"],
    });
    const user = await this.userRepository.findOne({ where: { id: userId } });

    idea = await this.vote(idea, user, Votes.UP);

    return this.toResponseObject(idea);
  }

  public async downvote(id: string, userId: string) {
    let idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ["author", "upvotes", "downvotes"],
    });
    const user = await this.userRepository.findOne({ where: { id: userId } });

    idea = await this.vote(idea, user, Votes.DOWN);

    return this.toResponseObject(idea);
  }

  public async bookmark(id: string, userId: string) {
    const idea = await this.ideaRepository.findOne({ where: { id } });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["bookmarks"],
    });

    if (!user.bookmarks.some(bookmark => bookmark.id === idea.id)) {
      user.bookmarks.push(idea);
      await this.userRepository.save(user);
    } else {
      throw new HttpException(
        "Idea already bookmarked",
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      user: {
        id: user.id,
        username: user.username,
        created: user.created,
        bookmarks: user.bookmarks,
      },
    };
  }

  public async unbookmark(id: string, userId: string) {
    const idea = await this.ideaRepository.findOne({ where: { id } });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["bookmarks"],
    });

    if (user.bookmarks.some(bookmark => bookmark.id === idea.id)) {
      user.bookmarks = user.bookmarks.filter(
        bookmark => bookmark.id !== idea.id,
      );

      await this.userRepository.save(user);
    } else {
      throw new HttpException(
        "Idea already bookmarked",
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      user: {
        id: user.id,
        username: user.username,
        created: user.created,
        bookmarks: user.bookmarks,
      },
    };
  }
}
