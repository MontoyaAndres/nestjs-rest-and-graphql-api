import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
/* import { GraphQLModule } from "@nestjs/graphql"; */

import { IdeaModule } from "./idea/idea.module";
import { HttpErrorFilter } from "./shared/http-error.filter";
import { LoggingInterceptor } from "./shared/logging.interceptor";
import { ValidationPipe } from "./shared/validation.pipe";
import { UserModule } from "./user/user.module";
import { CommentModule } from "./comment/comment.module";

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
      playground: process.env.NODE_ENV !== "production",
      autoSchemaFile: "schema.gql",
    }), */
    IdeaModule,
    UserModule,
    CommentModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
