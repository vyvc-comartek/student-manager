import { HttpException, HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
export class SqlHttpMappingHandler {
  static handle<Type>(result: Promise<Type>) {
    return result.catch((err: QueryFailedError) => {
      switch (err.driverError.code) {
        case 'ER_NO_REFERENCED_ROW_2':
          throw new HttpException(
            'Reference object does not exist',
            HttpStatus.BAD_REQUEST,
          );

        case 'ER_ROW_IS_REFERENCED_2':
          throw new HttpException(
            'This object being referenced cannot be deleted',
            HttpStatus.BAD_REQUEST,
          );

        default:
          break;
      }
    });
  }
}
