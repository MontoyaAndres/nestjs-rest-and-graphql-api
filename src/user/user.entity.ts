import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  BeforeInsert,
  OneToMany,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import * as argon2 from "argon2";

import { IdeaEntity } from "../idea/idea.entity";

@ObjectType()
@Entity("user")
export class UserEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => Date)
  @CreateDateColumn()
  created: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updated: Date;

  @Field()
  @Column({
    type: "text",
    unique: true,
  })
  username: string;

  @Column("text")
  password: string;

  @Field(() => [IdeaEntity])
  @OneToMany(() => IdeaEntity, idea => idea.author)
  ideas: IdeaEntity[];

  @ManyToMany(() => IdeaEntity, { cascade: true })
  @JoinTable()
  bookmarks: IdeaEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }
}
