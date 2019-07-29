import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
  JoinTable,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

import { UserEntity } from "../user/user.entity";
import { IdeaEntity } from "../idea/idea.entity";

@ObjectType()
@Entity("comment")
export class CommentEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => Date)
  @CreateDateColumn()
  created: Date;

  @Field()
  @Column("text")
  comment: string;

  @ManyToOne(() => UserEntity)
  @JoinTable()
  author: UserEntity;

  @ManyToOne(() => IdeaEntity, idea => idea.comments)
  idea: IdeaEntity;
}
