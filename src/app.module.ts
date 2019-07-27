import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
/* import { GraphQLModule } from "@nestjs/graphql"; */
import { IdeaModule } from "./idea/idea.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRES_HOST,
      port: 5432,
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: "ideas",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true,
      logging: true,
    }),
    /* GraphQLModule.forRoot({
      playground: process.env.NODE_ENV === "production",
      autoSchemaFile: "schema.gql",
    }), */
    IdeaModule,
  ],
})
export class AppModule {}
