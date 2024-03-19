import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ImagesService } from "./images.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { ParseImagePipe } from "../common/ImagePipe/ParseImage.pipe";
import { AuthenticationGuard, CognitoUser } from "@nestjs-cognito/auth";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Image } from "./entities/image.entity";

@ApiTags("Images")
@UseGuards(AuthenticationGuard)
// @Authorization({
//   allowedGroups: [SystemRoles.USER, SystemRoles.ADMIN],
// })
@Controller("images")
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post("/add")
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Upload an image" })
  @ApiOkResponse({ description: "Image uploaded", type: Image })
  create(
    @CognitoUser("sub") uuid: string,
    @UploadedFile(ParseImagePipe)
    file: Express.Multer.File
  ) {
    return this.imagesService.create(uuid, file);
  }

  @Get("getImages")
  @ApiOperation({ summary: "Get all images" })
  @ApiOkResponse({ description: "Images found", type: () => [Image] })
  findAll(@CognitoUser("sub") uuid: string) {
    return this.imagesService.findAll(uuid);
  }

  @ApiOperation({ summary: "Get a single image" })
  @ApiOkResponse({ description: "Image found", type: () => Image })
  @Get("/:imageId")
  findOne(@Param("imageId") imageId: string, @CognitoUser("sub") uuid: string) {
    return this.imagesService.findOne(uuid, imageId);
  }

  @ApiOperation({ summary: "Delete a single image" })
  @ApiOkResponse({ description: "Image deleted" })
  @Delete("/remove/:id")
  remove(@Param("id") id: string, @CognitoUser("sub") uuid: string) {
    return this.imagesService.remove(uuid, id);
  }
}
