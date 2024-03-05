import { Module } from "@nestjs/common";
import { ImagesService } from "./images.service";
import { ImagesController } from "./images.controller";
import { FileManagerModule } from "../file-manager/file-manager.module";

@Module({
  imports: [FileManagerModule],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
