import { HydratedDocument } from "mongoose";
import { Column, Entity } from "typeorm";
import { BeforeInsert, CreateDateColumn } from "typeorm/browser";
import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export type ImageDocument = HydratedDocument<Image>;

@Entity()
export class Image {
  @Column({})
  @IsString()
  @ApiProperty({
    description: "Image url used for s3 bucket",
  })
  imageUrl: string;

  @Column()
  @ApiProperty({
    description: "Image size",
  })
  imageSize: number;

  @Column()
  @ApiProperty({
    description: "User id",
  })
  userId: string;

  @CreateDateColumn()
  @ApiProperty({
    description: "Creation date of record",
  })
  readonly createdAt: Date;

  @Column()
  @ApiProperty({
    description: "Image extension",
  })
  imageExtension: string;

  @Column()
  readonly id: string;

  constructor(props: Omit<Image, "imageUrl" | "createdAt">) {
    Object.assign(this, props);
  }

  @BeforeInsert()
  private beforeInsert() {
    this.imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${this.userId}/${this.id}.${this.imageExtension}`;
  }
}
