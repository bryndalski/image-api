import type { ParseFilePipe } from "@nestjs/common";
import {
  HttpException,
  HttpStatus,
  ParseFilePipeBuilder,
} from "@nestjs/common";

/**
 * ParseImagePipe
 * @description: This pipe is used to parse the image file
 * @throws: HttpException
 * @returns: Express.Multer.File
 */
export const ParseImagePipe: ParseFilePipe = new ParseFilePipeBuilder().build({
  exceptionFactory(error) {
    console.log("error", error);
    throw new HttpException(error, HttpStatus.BAD_REQUEST);
  },
});
