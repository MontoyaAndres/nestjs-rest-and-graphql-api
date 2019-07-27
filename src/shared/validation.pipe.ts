import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { validate, ValidationError } from "class-validator";
import { plainToClass } from "class-transformer";

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (value instanceof Object && this.isEmpty(value)) {
      throw new HttpException(
        "Validation failed: No body submitted",
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      throw new HttpException(
        this.formatErrors(errors),
        HttpStatus.BAD_REQUEST,
      );
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];

    return !types.includes(metatype);
  }

  private formatErrors(errors: ValidationError[]) {
    return errors.map(err => {
      for (const property in err.constraints) {
        if (err.constraints.hasOwnProperty(property)) {
          return {
            path: err.property,
            message: err.constraints[property],
          };
        }
      }
    });
  }

  private isEmpty(value: any) {
    if (Object.keys(value).length > 0) {
      return false;
    }

    return true;
  }
}
