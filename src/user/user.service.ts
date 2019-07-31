import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";

import { UserEntity } from "./user.entity";
import { UserDTO } from "./dto/user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async showAll(page: number = 1) {
    const users = await this.userRepository.find({
      select: ["id", "username", "created"],
      relations: ["ideas", "bookmarks"],
      take: 25,
      skip: 25 * (page - 1),
    });

    return users;
  }

  async read(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ["ideas", "bookmarks"],
    });

    return user;
  }

  async login({ username, password }: UserDTO) {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new HttpException(
        { path: "user", message: "the user is wrong" },
        HttpStatus.BAD_REQUEST,
      );
    }

    const isPasswordCorrect = await argon2.verify(user.password, password);

    if (!isPasswordCorrect) {
      throw new HttpException(
        { path: "password", message: "the password is wrong" },
        HttpStatus.BAD_REQUEST,
      );
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        created: user.created,
      },
    };
  }

  async register(data: UserDTO) {
    let user = await this.userRepository.findOne({
      where: { username: data.username },
    });

    if (user) {
      throw new HttpException(
        "the user already exists",
        HttpStatus.BAD_REQUEST,
      );
    }

    user = await this.userRepository.create(data);
    await this.userRepository.save(user);

    return user;
  }
}
