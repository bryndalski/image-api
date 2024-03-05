import { Module } from "@nestjs/common";
import { ImagesService } from "./images.service";
import { ImagesController } from "./images.controller";
import { FileManagerModule } from "../file-manager/file-manager.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Image, ImageSchema } from "./entities/image.entity";

@Module({
  imports: [
    FileManagerModule,
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
  ],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
