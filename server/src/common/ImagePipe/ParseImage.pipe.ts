import { HttpException, HttpStatus, ParseFilePipe, ParseFilePipeBuilder } from "@nestjs/common";

/**
 * ParseImagePipe
 * @description: This pipe is used to parse the image file
 * @throws: HttpException
 * @returns: Express.Multer.File
 */
export const ParseImagePipe: ParseFilePipe = new ParseFilePipeBuilder()
  .addFileTypeValidator({
    fileType: "png",
  })
  .addFileTypeValidator({
    fileType: "jpeg",
  })
  .addFileTypeValidator({
    fileType: "jpg",
  })
  .addMaxSizeValidator({
    maxSize: 1000000, // just to you know it's possible.
  })
  .build({
    exceptionFactory(error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    },
  });
