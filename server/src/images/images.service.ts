import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { FileManagerService } from "../file-manager/file-manager.service";
import { v4 } from "uuid";
import { InjectModel } from "@nestjs/mongoose";
import { Image, ImageDocument } from "./entities/image.entity";
import { Model } from "mongoose";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ImagesService {
  constructor(
    @Inject(FileManagerService)
    private readonly fileManagerService: FileManagerService,
    @InjectModel(Image.name)
    private readonly imageModel: Model<ImageDocument>,
    private readonly configService: ConfigService
  ) {}

  /**
   * Create a new image and save it to S3
   * @param userUuid - The uuid of the user extracted from the JWT
   * @param image - The image to be saved
   * @returns Promise<ImageDocument>
   */
  async create(userUuid: string, image: Express.Multer.File) {
    const uuid = v4();

    const newImageMongoDocument = new Image({
      imageSize: image.size,
      userId: userUuid,
      imageExtension: image.mimetype.split("/")[1],
      id: uuid,
    });

    const newDatabaseImage = new this.imageModel({ ...newImageMongoDocument });

    const [fileSaveResult, newImage] = await Promise.all([
      this.fileManagerService.uploadImage(userUuid, uuid, image),
      newDatabaseImage.save(),
    ]);

    return newImage;
  }

  /**
   * Find all images from S3 related to user
   * @param userUuid - The uuid of the user
   * @returns Promise<ImageDocument[]>
   */
  async findAll(userUuid: string) {
    return this.imageModel.find({ userId: userUuid }) || [];
  }

  /**
   * Find a single image from S3
   * @param userUUID - The uuid of the user
   * @param imageUUID - The uuid of the image
   * @returns Promise<ImageDocument>
   */
  findOne(userUUID: string, imageUUID: string): Promise<ImageDocument> {
    return this.imageModel.findOne({ userId: userUUID, id: imageUUID });
  }

  /**
   * Deletes single image from S3
   * @param uuid - The uuid of the user
   * @param imageId - The id of the image to be deleted
   * @returns Promise<HttpStatusCode>
   */
  async remove(uuid: string, imageId: string) {
    await Promise.all([
      this.fileManagerService.deleteImage(uuid, imageId),
      this.imageModel.deleteOne({ userId: uuid, id: imageId }),
    ]);

    return HttpStatus.OK;
  }
}
