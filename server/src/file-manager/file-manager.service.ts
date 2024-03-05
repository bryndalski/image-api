import { Injectable } from "@nestjs/common";
import { S3 } from "@aws-sdk/client-s3";
import { fromContainerMetadata, fromIni } from "@aws-sdk/credential-providers";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FileManagerService {
  private readonly s3: S3;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3({
      region: "eu-west-1",
      ...(configService.get("NODE_ENV") !== "production"
        ? fromIni()
        : fromContainerMetadata()),
      forcePathStyle: true,
    });
  }

  /**
   * Deletes single image from S3
   * @param imageKey - The key of the image to be uploaded
   * @param uuid - The uuid of the user
   */
  async deleteImage(uuid: string, imageKey: string) {
    const Key = `${uuid}/${imageKey}`;

    return await this.s3.deleteObject({
      Bucket: this.configService.get("S3_BUCKET_NAME"),
      Key,
    });
  }

  /**
   * Uploads to S3
   * @description: Upload the organization logo
   * @param uuid user uuid
   * @param imageKey image key to be uploaded
   * @param file file to be uploaded
   */
  async uploadImage(uuid: string, imageKey: string, file: Express.Multer.File) {
    const Key = `${uuid}/${imageKey}`;
    const response = await this.uploadS3File(Key, file);
    return response.$metadata.httpStatusCode;
  }

  /**
   * @description: Upload the file to S3
   * @param objectKey The key of the object to be uploaded
   * @param file The file to be uploaded
   * @private
   */
  private async uploadS3File(objectKey: string, file: Express.Multer.File) {
    return await this.s3.putObject({
      Bucket: this.configService.get("S3_BUCKET_NAME"),
      Key: objectKey,
      Body: file.originalname,
    });
  }
}
