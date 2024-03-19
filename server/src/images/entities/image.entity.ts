import type { HydratedDocument } from "mongoose";
import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type ImageDocument = HydratedDocument<Image>;

@Schema()
export class Image {
  @Prop({
    required: true,
    type: String,
  })
  @IsString()
  @ApiProperty({
    description: "Image url used for s3 bucket",
  })
  @Prop({
    required: true,
    type: String,
  })
  imageUrl: string;

  @Prop({
    required: true,
    type: String,
  })
  @ApiProperty({
    description: "Image size",
  })
  imageSize: number;

  @Prop({
    required: true,
    type: String,
  })
  @ApiProperty({
    description: "User id",
  })
  userId: string;

  @Prop({
    required: true,
    type: String,
  })
  @ApiProperty({
    description: "Image name",
  })
  imageName: string;

  @Prop({
    default(val: any): any {
      return new Date();
    },
    type: Date,
    required: true,
  })
  @ApiProperty({
    description: "Creation date of record",
    type: Date,
    required: true,
  })
  readonly createdAt: Date;

  @Prop()
  @ApiProperty({
    description: "Image extension",
  })
  imageExtension: string;

  @Prop()
  @ApiProperty({
    description: "Is loved",
  })
  isLoved: boolean;

  @Prop({})
  readonly id: string;

  constructor(props: Omit<Image, "createdAt" | "setImageUrl">) {
    Object.assign(this, props);
  }

  static setImageUrl(uuid, extention, id): string {
    return `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET_NAME}/${uuid}/${id}.${extention}`;
  }
}

export const ImageSchema = SchemaFactory.createForClass(Image);
