import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

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
}
