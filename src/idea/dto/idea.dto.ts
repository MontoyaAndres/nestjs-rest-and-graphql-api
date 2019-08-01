import { InputType, Field } from "type-graphql";
import { IsString } from "class-validator";

@InputType()
export class IdeaDTO {
  @Field()
  @IsString()
  readonly idea: string;

  @Field()
  @IsString()
  readonly description: string;
}

@InputType()
export class IdeaUpdateDTO {
  @Field({ nullable: true })
  @IsString()
  readonly idea?: string;

  @Field({ nullable: true })
  @IsString()
  readonly description?: string;
}
