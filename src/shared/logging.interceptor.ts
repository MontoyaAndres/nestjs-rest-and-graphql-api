import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const now = Date.now();

    // This is for REST petitions
    if (request) {
      return next
        .handle()
        .pipe(
          tap(() =>
            Logger.log(
              `${request.method} ${request.url} ${Date.now() - now}ms`,
              `${context.getClass().name}.${context.getHandler().name}`,
            ),
          ),
        );
    } else {
      // This is for GRAPHQL petitions
      const ctx: any = GqlExecutionContext.create(context);
      const resolverName = ctx.constructorRef.name;
      const info = ctx.getInfo();

      return next
        .handle()
        .pipe(
          tap(() =>
            Logger.log(
              `${info.parentType} "${info.fieldName}" ${Date.now() - now}ms`,
              resolverName,
            ),
          ),
        );
    }
  }
}
