import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

import { UserEntity } from "../user/user.entity";

@ObjectType()
@Entity("idea")
export class IdeaEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => Date)
  @CreateDateColumn()
  created: Date;

  @Field()
  @UpdateDateColumn()
  updated: Date;

  @Field()
  @Column("text")
  idea: string;

  @Field()
  @Column("text")
  description: string;

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, author => author.ideas)
  author: UserEntity;
}
