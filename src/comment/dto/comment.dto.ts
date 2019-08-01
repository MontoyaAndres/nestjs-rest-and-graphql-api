import { Field, InputType } from "type-graphql";
import { IsString } from "class-validator";

@InputType()
export class CommentDTO {
  @Field()
  @IsString()
  comment: string;
}
