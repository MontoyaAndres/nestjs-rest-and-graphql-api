import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  HttpException,
} from "@nestjs/common";
import * as jwt from "jsonwebtoken";

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      return false;
    }

    const decoded = await this.validateToken(request.headers.authorization);
    request.user = decoded;

    return true;
  }

  private async validateToken(auth: string) {
    const token = auth.split(" ");

    if (token[0] !== "Bearer") {
      throw new HttpException("Invalid token", HttpStatus.FORBIDDEN);
    }

    try {
      const decode = await jwt.verify(token[1], process.env.JWT_SECRET);

      return decode;
    } catch (err) {
      const message = "Token error: " + (err.message || err.name);
      throw new HttpException(message, HttpStatus.FORBIDDEN);
    }
  }
}
